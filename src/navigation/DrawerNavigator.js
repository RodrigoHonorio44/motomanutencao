// src/navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../screens/HomeScreen';
import CadastroMotoScreen from '../screens/CadastroMotoScreen';
import AbastecimentoScreen from '../screens/AbastecimentoScreen';
import RegistrarManutencaoScreen from '../screens/RegistrarManutencaoScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
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
