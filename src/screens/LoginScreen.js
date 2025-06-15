import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../style/LoginStyles';
import Colors from '../style/Colors';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const senhaInputRef = useRef(null);

    const getErrorMessage = (error) => {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'Usuário não encontrado. Verifique seu e-mail.';
            case 'auth/wrong-password':
                return 'Senha incorreta. Tente novamente.';
            case 'auth/invalid-email':
                return 'E-mail inválido. Por favor, verifique.';
            case 'auth/user-disabled':
                return 'Usuário desabilitado. Contate o suporte.';
            default:
                return 'Ocorreu um erro. Tente novamente mais tarde.';
        }
    };

    const handleLogin = async () => {
        if (!email || !senha) {
            setMensagem('Por favor, preencha o e-mail e a senha.');
            return;
        }

        setMensagem('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, senha);
            navigation.replace('HomeDrawer');
        } catch (error) {
            setMensagem(getErrorMessage(error));
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
                <Text style={[styles.title, { color: Colors.textPrimary }]}>Bem-vindo!</Text>
                <Text style={[styles.subtitle, { color: Colors.textPrimary }]}>Faça login para continuar</Text>

                <TextInput
                    placeholder="Email"
                    placeholderTextColor={Colors.placeholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoFocus
                    returnKeyType="next"
                    onSubmitEditing={() => senhaInputRef.current.focus()}
                    blurOnSubmit={false}
                    style={styles.input}
                />

                <TextInput
                    ref={senhaInputRef}
                    placeholder="Senha"
                    placeholderTextColor={Colors.placeholder}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    style={styles.input}
                />

                {mensagem !== '' && (
                    <Text style={styles.errorText} accessibilityRole="alert">
                        {mensagem}
                    </Text>
                )}

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: loading }}
                >
                    <Text style={[styles.buttonText, { color: Colors.buttonText }]}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('RecuperarSenha')}>
                    <Text style={[styles.signupText, { color: Colors.textPrimary }]}>Esqueceu a senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                    <Text style={[styles.signupText, { color: Colors.textPrimary }]}>Não tem conta? Cadastre-se</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
