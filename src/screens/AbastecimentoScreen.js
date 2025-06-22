import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, getDocs, orderBy, query, where, doc, updateDoc, limit } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from '../style/AbastecimentoStyles';
import Colors from '../style/Colors';
import { Picker } from '@react-native-picker/picker';

export default function AbastecimentoScreen() {
    const [motos, setMotos] = useState([]);
    const [motoSelecionada, setMotoSelecionada] = useState(null);

    const [litros, setLitros] = useState('');
    const [precoLitro, setPrecoLitro] = useState('');
    const [kmAtual, setKmAtual] = useState('');
    const [tipoCombustivel, setTipoCombustivel] = useState('Gasolina');
    const [historico, setHistorico] = useState([]);
    const [consumoMedio, setConsumoMedio] = useState({});

    const precosPadrao = {
        Gasolina: '5.70',
        Álcool: '4.20',
    };

    useEffect(() => {
        async function fetchMotos() {
            try {
                const q = query(collection(db, 'motos'));
                const snapshot = await getDocs(q);
                const listaMotos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMotos(listaMotos);
                if (listaMotos.length > 0) setMotoSelecionada(listaMotos[0].id);
            } catch (e) {
                console.error('Erro ao buscar motos:', e);
            }
        }
        fetchMotos();
    }, []);

    useEffect(() => {
        setPrecoLitro(precosPadrao[tipoCombustivel]);
    }, [tipoCombustivel]);

    useEffect(() => {
        if (motoSelecionada) {
            fetchHistorico();
        }
    }, [motoSelecionada]);

    async function fetchHistorico() {
        try {
            const q = query(
                collection(db, 'abastecimentos'),
                where('motoId', '==', motoSelecionada),
                orderBy('data', 'desc'),
                limit(4)
            );
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHistorico(list);
            calcularConsumoMedio(list);
        } catch (e) {
            console.error('Erro ao buscar histórico:', e);
        }
    }

    function calcularConsumoMedio(list) {
        const tipos = ['Gasolina', 'Álcool'];
        const resultados = {};

        tipos.forEach(tipo => {
            const abastecimentos = list.filter(item => item.tipoCombustivel === tipo);

            if (abastecimentos.length >= 2) {
                let totalKm = 0;
                let totalLitros = 0;

                for (let i = 0; i < abastecimentos.length - 1; i++) {
                    const diffKm = abastecimentos[i].kmAtual - abastecimentos[i + 1].kmAtual;
                    totalKm += diffKm;
                    totalLitros += abastecimentos[i].litros;
                }

                if (totalLitros > 0) {
                    resultados[tipo] = (totalKm / totalLitros).toFixed(1);
                }
            }
        });

        setConsumoMedio(resultados);
    }

    async function handleSalvar() {
        if (!motoSelecionada) {
            Alert.alert('Erro', 'Selecione uma moto.');
            return;
        }
        if (!litros || !precoLitro || !kmAtual || !tipoCombustivel) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        const litrosFloat = parseFloat(litros.replace(',', '.'));
        const precoFloat = parseFloat(precoLitro.replace(',', '.'));
        const kmInt = parseInt(kmAtual, 10);

        if (isNaN(litrosFloat) || isNaN(precoFloat) || isNaN(kmInt)) {
            Alert.alert('Erro', 'Digite valores numéricos válidos.');
            return;
        }

        try {
            const novo = {
                motoId: motoSelecionada,
                litros: litrosFloat,
                precoLitro: precoFloat,
                kmAtual: kmInt,
                tipoCombustivel,
                data: new Date(),
            };

            await addDoc(collection(db, 'abastecimentos'), novo);

            const motoRef = doc(db, 'motos', motoSelecionada);
            await updateDoc(motoRef, { kmtotal: kmInt });

            Alert.alert('Sucesso', 'Abastecimento salvo e km da moto atualizado!');
            setLitros('');
            setPrecoLitro(precosPadrao[tipoCombustivel]);
            setKmAtual('');
            fetchHistorico();
        } catch (e) {
            console.error('Erro ao salvar:', e);
            Alert.alert('Erro', 'Não foi possível salvar.');
        }
    }

    // RENDERIZAÇÃO PRINCIPAL COM FlatList
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <FlatList
                data={historico}
                keyExtractor={item => item.id}
                ListHeaderComponent={
                    <>
                        <Text style={styles.title}>Lançar Abastecimento</Text>

                        {/* Picker de Moto */}
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={motoSelecionada}
                                onValueChange={setMotoSelecionada}
                                style={styles.picker}
                            >
                                {motos.map(moto => (
                                    <Picker.Item
                                        key={moto.id}
                                        label={`${moto.marca.trim()} ${moto.modelo.trim()} - Placa: ${moto.placa.trim()}`}
                                        value={moto.id}
                                    />
                                ))}
                            </Picker>
                        </View>

                        {/* Picker de Combustível */}
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={tipoCombustivel}
                                onValueChange={setTipoCombustivel}
                                style={styles.picker}
                            >
                                <Picker.Item label="Gasolina" value="Gasolina" />
                                <Picker.Item label="Álcool" value="Álcool" />
                            </Picker>
                        </View>

                        {/* Campos de entrada */}
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

                        {/* Consumo médio */}
                        <View style={{ marginTop: 15 }}>
                            {Object.keys(consumoMedio).length === 0 ? (
                                <Text style={styles.subtitle}>Consumo médio ainda não disponível</Text>
                            ) : (
                                Object.entries(consumoMedio).map(([tipo, consumo]) => (
                                    <Text key={tipo} style={styles.subtitle}>
                                        Consumo médio com {tipo} = {consumo} km/l
                                    </Text>
                                ))
                            )}
                        </View>

                        <Text style={[styles.title, { marginTop: 20 }]}>Últimos Abastecimentos</Text>
                    </>
                }
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: '#fff',
                            padding: 12,
                            marginBottom: 10,
                            borderRadius: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
                            Data:{' '}
                            {item.data?.seconds
                                ? new Date(item.data.seconds * 1000).toLocaleDateString('pt-BR')
                                : ''}
                        </Text>
                        <Text>Combustível: {item.tipoCombustivel}</Text>
                        <Text>Km Atual: {item.kmAtual}</Text>
                        <Text>Litros: {item.litros}</Text>
                        <Text>Preço por Litro: R$ {item.precoLitro.toFixed(2)}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.subtitle}>Nenhum abastecimento cadastrado.</Text>}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            />
        </KeyboardAvoidingView>
    );
}
