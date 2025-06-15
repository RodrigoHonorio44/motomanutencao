import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeScreen from './src/screens/HomeScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';
import CadastroMotoScreen from './src/screens/CadastroMotoScreen';
import RegistrarManutencaoScreen from './src/screens/RegistrarManutencaoScreen';
import PerfilScreen from './src/screens/PerfilScreen';  // Importa a nova tela

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaScreen} />
        <Stack.Screen name="CadastroMoto" component={CadastroMotoScreen} />
        <Stack.Screen name="RegistrarManutencao" component={RegistrarManutencaoScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
