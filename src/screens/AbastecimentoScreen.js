import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { collection, addDoc, getDocs, orderBy, query, where, doc, updateDoc } from 'firebase/firestore';
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
        Álcool: '4.20'
    };

    useEffect(() => {
        async function fetchMotos() {
            try {
                const q = query(collection(db, 'motos'));
                const snapshot = await getDocs(q);
                const listaMotos = [];
                snapshot.forEach(doc => listaMotos.push({ id: doc.id, ...doc.data() }));
                setMotos(listaMotos);
                if (listaMotos.length > 0) setMotoSelecionada(listaMotos[0].id);
            } catch (e) {
                console.log('Erro ao buscar motos:', e);
            }
        }
        fetchMotos();
    }, []);

    useEffect(() => {
        setPrecoLitro(precosPadrao[tipoCombustivel]);
    }, [tipoCombustivel]);

    useEffect(() => {
        fetchHistorico();
    }, [motoSelecionada]);

    async function fetchHistorico() {
        try {
            let q;
            if (motoSelecionada) {
                q = query(
                    collection(db, 'abastecimentos'),
                    where('motoId', '==', motoSelecionada),
                    orderBy('data', 'desc')
                );
            } else {
                q = query(collection(db, 'abastecimentos'), orderBy('data', 'desc'));
            }
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
        const tipos = ['Gasolina', 'Álcool'];
        let resultados = {};

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
                    const consumo = (totalKm / totalLitros).toFixed(1);
                    resultados[tipo] = consumo;
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

        try {
            const novo = {
                motoId: motoSelecionada,
                litros: parseFloat(litros.replace(',', '.')),
                precoLitro: parseFloat(precoLitro.replace(',', '.')),
                kmAtual: parseInt(kmAtual, 10),
                tipoCombustivel,
                data: new Date(),
            };

            await addDoc(collection(db, 'abastecimentos'), novo);

            // >>> Atualiza o kmtotal da moto na coleção 'motos'
            const motoRef = doc(db, 'motos', motoSelecionada);
            await updateDoc(motoRef, {
                kmtotal: parseInt(kmAtual, 10)
            });

            Alert.alert('Sucesso', 'Abastecimento salvo e km da moto atualizado!');
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

            {/* Picker para escolher a moto */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={motoSelecionada}
                    onValueChange={(itemValue) => setMotoSelecionada(itemValue)}
                    style={styles.picker}
                >
                    {motos.map(moto => (
                        <Picker.Item key={moto.id} label={moto.nomeMoto || 'Moto sem nome'} value={moto.id} />
                    ))}
                </Picker>
            </View>

            {/* Picker para tipo de combustível */}
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
