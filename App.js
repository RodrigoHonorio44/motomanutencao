import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

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

// Drawer com as telas internas do app
function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Cadastrar Moto" component={CadastroMotoScreen} />
      <Drawer.Screen name="Abastecimento" component={AbastecimentoScreen} />
      <Drawer.Screen name="Registrar Manutenção" component={RegistrarManutencaoScreen} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
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
