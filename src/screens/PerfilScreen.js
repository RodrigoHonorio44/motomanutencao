// src/screens/PerfilScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../config/firebaseConfig';
import styles from '../style/PerfilStyles';
import Colors from '../style/Colors';

export default function PerfilScreen({ navigation }) {
    const [usuario, setUsuario] = useState(null);
    const [nome, setNome] = useState('');
    const [foto, setFoto] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsuario(user);
                setNome(user.displayName || '');
                setFoto(user.photoURL || null);
            }
        });
        return unsubscribe;
    }, []);

    async function escolherImagem() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Habilite a permissão de acesso à galeria.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    }

    async function uploadImagem(uri) {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const uid = auth.currentUser.uid;
            const storageRef = ref(storage, `usuarios/${uid}/perfil.jpg`);
            await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(storageRef);
            return url;
        } catch (error) {
            console.log('Erro no upload:', error);
            throw error;
        }
    }

    async function salvarPerfil() {
        if (!usuario) return;
        setLoading(true);

        try {
            let photoURL = usuario.photoURL;

            if (foto && foto !== usuario.photoURL) {
                photoURL = await uploadImagem(foto);
            }

            await updateProfile(auth.currentUser, {
                displayName: nome,
                photoURL,
            });

            await auth.currentUser.reload();
            const updatedUser = auth.currentUser;
            setUsuario(updatedUser);
            setFoto(updatedUser.photoURL);

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        } catch (error) {
            console.log('Erro ao salvar perfil:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
        }

        setLoading(false);
    }

    if (!usuario) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={escolherImagem}>
                <Image
                    source={{ uri: foto || 'https://via.placeholder.com/100' }}
                    style={styles.avatar}
                />
                <Text style={styles.alterarFotoText}>Alterar Foto</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor={Colors.placeholder}
                value={nome}
                onChangeText={setNome}
            />

            <Text style={styles.email}>{usuario.email}</Text>

            <TouchableOpacity style={styles.button} onPress={salvarPerfil} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar Perfil'}</Text>
            </TouchableOpacity>
        </View>
    );
}
