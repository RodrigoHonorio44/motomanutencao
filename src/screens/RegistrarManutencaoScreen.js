import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../style/RegistrarManutencaoStyles';
import Colors from '../style/Colors';

export default function RegistrarManutencaoScreen({ navigation }) {
    const [motos, setMotos] = useState([]);
    const [motoSelecionada, setMotoSelecionada] = useState('');
    const [tipo, setTipo] = useState('');
    const [produto, setProduto] = useState('');
    const [valorProduto, setValorProduto] = useState('');
    const [valorMaoDeObra, setValorMaoDeObra] = useState('');
    const [data, setData] = useState(new Date());
    const [km, setKm] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const fetchMotos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'motos'));
                const motosList = [];
                querySnapshot.forEach(doc => {
                    motosList.push({ id: doc.id, ...doc.data() });
                });
                setMotos(motosList);
            } catch (error) {
                console.log('Erro ao buscar motos:', error);
            }
        };

        fetchMotos();
    }, []);

    const formatarData = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setData(selectedDate);
        }
    };

    const limparCampos = () => {
        setMotoSelecionada('');
        setTipo('');
        setProduto('');
        setValorProduto('');
        setValorMaoDeObra('');
        setKm('');
        setData(new Date());
    };

    const handleSalvar = async () => {
        if (
            !motoSelecionada ||
            !tipo.trim() ||
            !produto.trim() ||
            !valorProduto.trim() ||
            !valorMaoDeObra.trim() ||
            !km.trim()
        ) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        const valorProdutoFloat = parseFloat(valorProduto.replace(',', '.'));
        const valorMaoDeObraFloat = parseFloat(valorMaoDeObra.replace(',', '.'));
        const kmInt = parseInt(km, 10);

        if (isNaN(valorProdutoFloat) || isNaN(valorMaoDeObraFloat) || isNaN(kmInt)) {
            Alert.alert('Erro', 'Digite valores numéricos válidos para valores e km.');
            return;
        }

        try {
            // 1. Salva a manutenção
            await addDoc(collection(db, 'manutencoes'), {
                motoId: motoSelecionada,
                tipo: tipo.trim(),
                produto: produto.trim(),
                valorProduto: valorProdutoFloat,
                valorMaoDeObra: valorMaoDeObraFloat,
                data: data,
                km: kmInt,
                criadoEm: new Date(),
            });

            // 2. Atualiza o kmtotal da moto na coleção motos
            const motoRef = doc(db, 'motos', motoSelecionada);
            await updateDoc(motoRef, { kmtotal: kmInt });

            Alert.alert('Sucesso', 'Manutenção registrada e KM da moto atualizado!');
            limparCampos();
            // navigation.goBack(); // Se quiser voltar automaticamente
        } catch (error) {
            console.log('Erro ao salvar manutenção:', error);
            Alert.alert('Erro', 'Não foi possível salvar a manutenção.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrar Manutenção</Text>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={motoSelecionada}
                    onValueChange={setMotoSelecionada}
                    style={styles.picker}
                    itemStyle={{ fontSize: 16 }}
                >
                    <Picker.Item label="Selecione a moto" value="" />
                    {motos.map((moto) => (
                        <Picker.Item
                            key={moto.id}
                            label={`${moto.marca} ${moto.modelo} - Placa: ${moto.placa}`}
                            value={moto.id}
                        />
                    ))}
                </Picker>
            </View>

            <TextInput
                placeholder="Tipo de Serviço"
                value={tipo}
                onChangeText={setTipo}
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
            />

            <TextInput
                placeholder="Nome do Produto (ex: Kit Relação, Óleo)"
                value={produto}
                onChangeText={setProduto}
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
            />

            <TextInput
                placeholder="Valor do Produto (R$)"
                value={valorProduto}
                onChangeText={setValorProduto}
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
                keyboardType="decimal-pad"
            />

            <TextInput
                placeholder="Valor da Mão de Obra (R$)"
                value={valorMaoDeObra}
                onChangeText={setValorMaoDeObra}
                style={styles.input}
                placeholderTextColor={Colors.placeholder}
                keyboardType="decimal-pad"
            />

            <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={{ color: data ? '#000' : Colors.placeholder, fontSize: 16 }}>
                    {formatarData(data)}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={data}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            <TextInput
                placeholder="Km Atual"
                value={km}
                onChangeText={setKm}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor={Colors.placeholder}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
                <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('Home')}
                activeOpacity={0.7}
            >
                <Text style={styles.backButtonText}>Voltar para Home</Text>
            </TouchableOpacity>
        </View>
    );
}
