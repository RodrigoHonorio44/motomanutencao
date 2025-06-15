import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from '../style/AbastecimentoStyles';
import Colors from '../style/Colors';
import { Picker } from '@react-native-picker/picker';

export default function AbastecimentoScreen() {
    const [litros, setLitros] = useState('');
    const [precoLitro, setPrecoLitro] = useState('');
    const [kmAtual, setKmAtual] = useState('');
    const [tipoCombustivel, setTipoCombustivel] = useState('Gasolina');
    const [historico, setHistorico] = useState([]);
    const [consumoMedio, setConsumoMedio] = useState(0);

    const precosPadrao = {
        Gasolina: '5.70',
        Álcool: '4.20'
    };

    useEffect(() => {
        setPrecoLitro(precosPadrao[tipoCombustivel]); // Sempre que mudar o combustível
    }, [tipoCombustivel]);

    useEffect(() => {
        fetchHistorico();
    }, []);

    async function fetchHistorico() {
        try {
            const q = query(collection(db, 'abastecimentos'), orderBy('data', 'desc'));
            const snapshot = await getDocs(q);
            const list = [];
            snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            setHistorico(list);
            calcularConsumoMedio(list);
        } catch (e) {
            console.log('Erro ao buscar histórico:', e);
        }
    }

    function calcularConsumoMedio(list) {
        if (list.length < 2) {
            setConsumoMedio(0);
            return;
        }
        let totalKm = 0, totalLitros = 0;
        for (let i = 0; i < list.length - 1; i++) {
            const diffKm = list[i].kmAtual - list[i + 1].kmAtual;
            totalKm += diffKm;
            totalLitros += list[i].litros;
        }
        setConsumoMedio((totalKm / totalLitros).toFixed(2));
    }

    async function handleSalvar() {
        if (!litros || !precoLitro || !kmAtual || !tipoCombustivel) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }
        try {
            const novo = {
                litros: parseFloat(litros.replace(',', '.')),
                precoLitro: parseFloat(precoLitro.replace(',', '.')),
                kmAtual: parseInt(kmAtual, 10),
                tipoCombustivel,
                data: new Date(),
            };
            await addDoc(collection(db, 'abastecimentos'), novo);
            setLitros('');
            setKmAtual('');
            fetchHistorico();
        } catch (e) {
            console.log('Erro ao salvar:', e);
            Alert.alert('Erro', 'Não foi possível salvar.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lançar Abastecimento</Text>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={tipoCombustivel}
                    onValueChange={(itemValue) => setTipoCombustivel(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Gasolina" value="Gasolina" />
                    <Picker.Item label="Álcool" value="Álcool" />
                </Picker>
            </View>

            <TextInput
                placeholder="Preço por Litro (R$)"
                placeholderTextColor={Colors.placeholder}
                keyboardType="decimal-pad"
                style={styles.input}
                value={precoLitro}
                onChangeText={setPrecoLitro}
            />

            <TextInput
                placeholder="Litros abastecidos"
                placeholderTextColor={Colors.placeholder}
                keyboardType="decimal-pad"
                style={styles.input}
                value={litros}
                onChangeText={setLitros}
            />

            <TextInput
                placeholder="Km atual da moto"
                placeholderTextColor={Colors.placeholder}
                keyboardType="numeric"
                style={styles.input}
                value={kmAtual}
                onChangeText={setKmAtual}
            />

            <TouchableOpacity style={styles.button} onPress={handleSalvar}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>Consumo Médio: {consumoMedio} km/l</Text>

            <FlatList
                data={historico}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>Data: {new Date(item.data.seconds * 1000).toLocaleDateString()}</Text>
                        <Text>Combustível: {item.tipoCombustivel}</Text>
                        <Text>Km: {item.kmAtual}</Text>
                        <Text>Litros: {item.litros}</Text>
                        <Text>Preço por Litro: R$ {item.precoLitro.toFixed(2)}</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}
