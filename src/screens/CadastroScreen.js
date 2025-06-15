import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../style/CadastroStyles';
import Colors from '../style/Colors';

export default function CadastroScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const getErrorMessage = (error) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.';
            case 'auth/invalid-email':
                return 'E-mail inválido. Verifique o formato.';
            case 'auth/weak-password':
                return 'A senha precisa ter pelo menos 6 caracteres.';
            default:
                return `Erro inesperado: ${error.message || error.code}`;
        }
    };

    const handleCadastro = async () => {
        if (!email || !senha || !confirmarSenha) {
            setErrorMsg('Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmarSenha) {
            setErrorMsg('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                criadoEm: new Date(),
            });

            navigation.replace('Home');
        } catch (error) {
            console.log('Erro Firebase Cadastro:', error);
            setErrorMsg(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <Text style={[styles.titulo, { color: Colors.textPrimary }]}>Cadastro</Text>

                <TextInput
                    placeholder="Email"
                    placeholderTextColor={Colors.placeholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Senha"
                    placeholderTextColor={Colors.placeholder}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    style={styles.input}
                />

                <TextInput
                    placeholder="Confirmar Senha"
                    placeholderTextColor={Colors.placeholder}
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry
                    style={styles.input}
                />

                {errorMsg !== '' && (
                    <Text style={[styles.errorText, { color: '#ffcccc' }]} accessibilityRole="alert">
                        {errorMsg}
                    </Text>
                )}

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleCadastro}
                    disabled={loading}
                >
                    <Text style={[styles.buttonText, { color: Colors.buttonText }]}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.loginText, { color: Colors.textPrimary }]}>
                        Já tem uma conta? Fazer Login
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
