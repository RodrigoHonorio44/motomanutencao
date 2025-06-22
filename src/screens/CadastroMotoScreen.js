import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from '../style/CadastroMotoStyles';
import Colors from '../style/Colors';

export default function CadastroMotoScreen({ navigation }) {
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [ano, setAno] = useState('');
    const [kmAtual, setKmAtual] = useState('');
    const [cor, setCor] = useState('');
    const [placa, setPlaca] = useState('');

    const handleSalvarMoto = async () => {
        if (!marca || !modelo || !ano || !kmAtual || !cor || !placa) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        const anoNumerico = parseInt(ano, 10);
        const kmAtualNumerico = parseInt(kmAtual, 10);

        if (isNaN(anoNumerico) || isNaN(kmAtualNumerico)) {
            Alert.alert('Erro', 'Ano e Km Atual devem ser números válidos.');
            return;
        }

        try {
            await addDoc(collection(db, 'motos'), {
                marca: marca.trim(),
                modelo: modelo.trim(),
                ano: anoNumerico,
                kmAtual: kmAtualNumerico,
                cor: cor.trim(),
                placa: placa.trim().toUpperCase(),
                criadoEm: new Date(),
            });
            Alert.alert('Sucesso', 'Moto cadastrada com sucesso!');

            // Limpar campos para novo cadastro, se quiser:
            setMarca('');
            setModelo('');
            setAno('');
            setKmAtual('');
            setCor('');
            setPlaca('');

            navigation.navigate('Home');
        } catch (error) {
            console.log('Erro ao salvar moto:', error);
            Alert.alert('Erro', 'Não foi possível salvar a moto.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Cadastrar Moto</Text>

                <TextInput
                    placeholder="Marca"
                    value={marca}
                    onChangeText={setMarca}
                    style={styles.input}
                    placeholderTextColor={Colors.placeholder}
                    autoCapitalize="words"
                />
                <TextInput
                    placeholder="Modelo"
                    value={modelo}
                    onChangeText={setModelo}
                    style={styles.input}
                    placeholderTextColor={Colors.placeholder}
                    autoCapitalize="words"
                />
                <TextInput
                    placeholder="Ano"
                    value={ano}
                    onChangeText={setAno}
                    style={styles.input}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.placeholder}
                    maxLength={4}
                />
                <TextInput
                    placeholder="Km Atual"
                    value={kmAtual}
                    onChangeText={setKmAtual}
                    style={styles.input}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.placeholder}
                />
                <TextInput
                    placeholder="Cor do Veículo"
                    value={cor}
                    onChangeText={setCor}
                    style={styles.input}
                    placeholderTextColor={Colors.placeholder}
                    autoCapitalize="words"
                />
                <TextInput
                    placeholder="Placa"
                    value={placa}
                    onChangeText={setPlaca}
                    style={styles.input}
                    placeholderTextColor={Colors.placeholder}
                    autoCapitalize="characters"
                    maxLength={8}
                />

                <TouchableOpacity style={styles.button} onPress={handleSalvarMoto}>
                    <Text style={styles.buttonText}>Salvar Moto</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
