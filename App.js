import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';

import HomeScreen from './src/screens/HomeScreen';
import CadastroMotoScreen from './src/screens/CadastroMotoScreen';
import RegistrarManutencaoScreen from './src/screens/RegistrarManutencaoScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import AbastecimentoScreen from './src/screens/AbastecimentoScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const auth = getAuth();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente sair do sistema?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              props.navigation.replace('Login');
            } catch (error) {
              console.error('Erro ao sair:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      <View>
        <DrawerItemList {...props} />
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        }}
      >
        <Ionicons name="log-out-outline" size={24} color="red" />
        <Text style={{ color: 'red', marginLeft: 12, fontWeight: '600' }}>
          {usuario?.displayName
            ? `Logout (${usuario.displayName})`
            : 'Logout'}
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

// Drawer com as telas internas do app, usando conteúdo customizado
function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Cadastrar Moto" component={CadastroMotoScreen} />
      <Drawer.Screen name="Abastecimento" component={AbastecimentoScreen} />
      <Drawer.Screen
        name="Registrar Manutenção"
        component={RegistrarManutencaoScreen}
      />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Telas públicas */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaScreen} />

        {/* Drawer com telas internas */}
        <Stack.Screen name="HomeDrawer" component={AppDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
