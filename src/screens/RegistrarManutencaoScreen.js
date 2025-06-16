import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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
    const [valorProduto, setValorProduto] = useState('');  // Valor do produto (ex: óleo, kit relação)
    const [valorMaoDeObra, setValorMaoDeObra] = useState(''); // Novo: valor da mão de obra
    const [data, setData] = useState('');
    const [km, setKm] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatarData = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

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
        setData(formatarData(new Date()));
    }, []);

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setData(formatarData(selectedDate));
        }
    };

    const limparCampos = () => {
        setMotoSelecionada('');
        setTipo('');
        setProduto('');
        setValorProduto('');
        setValorMaoDeObra('');
        setKm('');
        setData(formatarData(new Date()));
    };

    const handleSalvar = async () => {
        if (
            !motoSelecionada ||
            !tipo ||
            !produto ||
            !valorProduto ||
            !valorMaoDeObra ||
            !data ||
            !km
        ) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        try {
            await addDoc(collection(db, 'manutencoes'), {
                moto: motoSelecionada,
                tipo,
                produto,
                valorProduto: parseFloat(valorProduto.replace(',', '.')),
                valorMaoDeObra: parseFloat(valorMaoDeObra.replace(',', '.')),
                data,
                km,
                criadoEm: new Date(),
            });
            Alert.alert('Sucesso', 'Manutenção registrada!');
            limparCampos();
            // navigation.goBack(); // opcional
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
                    onValueChange={(itemValue) => setMotoSelecionada(itemValue)}
                    style={styles.picker}
                    itemStyle={{ fontSize: 16 }}
                >
                    <Picker.Item label="Selecione a moto" value="" />
                    {motos.map((moto) => (
                        <Picker.Item
                            key={moto.id}
                            label={`${moto.marca} ${moto.modelo} (${moto.ano})`}
                            value={`${moto.marca} ${moto.modelo} (${moto.ano})`}
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

            {/* Novo campo: Valor da Mão de Obra */}
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
                    {data || 'Selecione a Data'}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
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
