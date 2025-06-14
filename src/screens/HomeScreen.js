import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import styles from '../style/HomeStyles';

export default function HomeScreen({ navigation }) {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace('Login');
        } catch (error) {
            console.log('Erro ao fazer logout:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Bem-vindo à Home!</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}
