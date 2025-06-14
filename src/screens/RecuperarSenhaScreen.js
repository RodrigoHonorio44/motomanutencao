import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../style/LoginStyles';
import Colors from '../style/Colors';

export default function RecuperarSenhaScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRecuperarSenha = async () => {
        if (!email) {
            Alert.alert('Erro', 'Por favor, informe o e-mail.');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Sucesso', 'E-mail de recuperação enviado! Verifique sua caixa de entrada.');
            navigation.goBack();
        } catch (error) {
            let mensagem = '';

            switch (error.code) {
                case 'auth/user-not-found':
                    mensagem = 'E-mail não encontrado. Verifique e tente novamente.';
                    break;
                case 'auth/invalid-email':
                    mensagem = 'Formato de e-mail inválido.';
                    break;
                default:
                    mensagem = 'Erro ao tentar recuperar a senha. Tente novamente.';
                    break;
            }

            Alert.alert('Erro', mensagem);
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
                <Text style={[styles.title, { color: Colors.textPrimary }]}>Recuperar Senha</Text>
                <Text style={[styles.subtitle, { color: Colors.textPrimary }]}>
                    Informe seu e-mail para receber o link de recuperação.
                </Text>

                <TextInput
                    placeholder="Email"
                    placeholderTextColor={Colors.placeholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleRecuperarSenha}
                    disabled={loading}
                >
                    <Text style={[styles.buttonText, { color: Colors.buttonText }]}>
                        {loading ? 'Enviando...' : 'Enviar e-mail de recuperação'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.signupText, { color: Colors.textPrimary }]}>Voltar ao Login</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
