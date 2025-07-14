import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from '../style/PerfilStyles';
import Colors from '../style/Colors';

export default function PerfilScreen() {
    const [motos, setMotos] = useState([]);
    const [motoSelecionada, setMotoSelecionada] = useState(null);
    const [loading, setLoading] = useState(true);

    const [gastos, setGastos] = useState(0); // total combustível + manutenção
    const [consumo, setConsumo] = useState(0);
    const [custoPorKm, setCustoPorKm] = useState(0);
    const [proximaManutencao, setProximaManutencao] = useState('');
    const [gastoCombustivel, setGastoCombustivel] = useState(0);
    const [gastoManutencao, setGastoManutencao] = useState(0);
    const [litrosMes, setLitrosMes] = useState(0);
    const [qtdAbastecimentos, setQtdAbastecimentos] = useState(0);

    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFim, setDataFim] = useState(new Date());

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
                Alert.alert('Erro', 'Não foi possível carregar as motos.');
            } finally {
                setLoading(false);
            }
        }

        fetchMotos();
    }, []);

    useEffect(() => {
        if (motoSelecionada) {
            const inicio = new Date();
            inicio.setDate(1);
            inicio.setHours(0, 0, 0, 0);

            const fim = new Date();
            fim.setHours(23, 59, 59, 999);

            setDataInicio(inicio);
            setDataFim(fim);

            buscarDadosDaMoto(motoSelecionada);
            calcularResumoGastos(motoSelecionada, inicio, fim);
        }
    }, [motoSelecionada]);

    async function buscarDadosDaMoto(id) {
        setLoading(true);
        try {
            const docRef = doc(db, 'motos', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const dados = docSnap.data();
                setProximaManutencao(dados.proximaManutencao || '');
            } else {
                setProximaManutencao('');
            }
        } catch (error) {
            console.error('Erro ao buscar dados da moto:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados da moto.');
        } finally {
            setLoading(false);
        }
    }

    async function calcularGastoManutencao(motoId, inicio, fim) {
        try {
            const q = query(collection(db, 'manutencoes'));
            const snapshot = await getDocs(q);

            let totalManutencao = 0;

            snapshot.forEach(doc => {
                const data = doc.data();
                const dataManutencao = data.criadoEm ? data.criadoEm.toDate() : null;

                if (
                    data.motoId === motoId &&
                    dataManutencao &&
                    dataManutencao >= inicio &&
                    dataManutencao <= fim
                ) {
                    const valorProduto = data.valorProduto || 0;
                    const valorMaoDeObra = data.valorMaoDeObra || 0;
                    totalManutencao += valorProduto + valorMaoDeObra;
                }
            });

            setGastoManutencao(totalManutencao);
            return totalManutencao;
        } catch (error) {
            console.error('Erro ao calcular gasto de manutenção:', error);
            setGastoManutencao(0);
            return 0;
        }
    }

    async function calcularResumoGastos(motoId, inicio, fim) {
        setLoading(true);
        try {
            // Calcular combustível
            const q = query(collection(db, 'abastecimentos'));
            const snapshot = await getDocs(q);

            let totalValorCombustivel = 0;
            let totalLitros = 0;
            let abastecimentosFiltrados = [];

            snapshot.forEach(doc => {
                const data = doc.data();
                const dataAbastecimento = data.data ? data.data.toDate() : null;

                if (
                    data.motoId === motoId &&
                    dataAbastecimento &&
                    dataAbastecimento >= inicio &&
                    dataAbastecimento <= fim
                ) {
                    abastecimentosFiltrados.push(data);
                    const litros = data.litros || 0;
                    const preco = data.precoLitro || 0;
                    totalLitros += litros;
                    totalValorCombustivel += litros * preco;
                }
            });

            abastecimentosFiltrados.sort((a, b) => a.kmAtual - b.kmAtual);
            const kmInicial = abastecimentosFiltrados[0]?.kmAtual || 0;
            const kmFinal = abastecimentosFiltrados[abastecimentosFiltrados.length - 1]?.kmAtual || 0;
            const distanciaPercorrida = kmFinal - kmInicial;

            const mediaConsumo = totalLitros > 0 ? distanciaPercorrida / totalLitros : 0;
            const custoPorKmRodado = distanciaPercorrida > 0 ? totalValorCombustivel / distanciaPercorrida : 0;

            setLitrosMes(totalLitros);
            setGastoCombustivel(totalValorCombustivel);
            setConsumo(mediaConsumo);
            setCustoPorKm(custoPorKmRodado);
            setQtdAbastecimentos(abastecimentosFiltrados.length);

            // Calcular manutenção
            const totalManutencao = await calcularGastoManutencao(motoId, inicio, fim);

            // Total geral (combustível + manutenção)
            setGastos(totalValorCombustivel + totalManutencao);
        } catch (error) {
            console.error('Erro ao calcular resumo de gastos:', error);
            setLitrosMes(0);
            setGastoCombustivel(0);
            setConsumo(0);
            setCustoPorKm(0);
            setQtdAbastecimentos(0);
            setGastoManutencao(0);
            setGastos(0);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold' }}>
                Selecione a moto:
            </Text>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={motoSelecionada}
                    onValueChange={setMotoSelecionada}
                    style={styles.picker}
                    mode="dropdown"
                >
                    {motos.map(moto => (
                        <Picker.Item
                            key={moto.id}
                            label={`${(moto.marca || '').trim()} ${(moto.modelo || '').trim()} - Placa: ${(moto.placa || '').trim()}`}
                            value={moto.id}
                        />
                    ))}
                </Picker>
            </View>

            <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Filtrar por período:</Text>
            <Text style={styles.resumoTexto}>Data início:</Text>
            <DateTimePicker
                value={dataInicio}
                mode="date"
                display="default"
                onChange={(e, date) => date && setDataInicio(date)}
            />
            <Text style={styles.resumoTexto}>Data fim:</Text>
            <DateTimePicker
                value={dataFim}
                mode="date"
                display="default"
                onChange={(e, date) => date && setDataFim(date)}
            />

            <Text
                style={{
                    color: 'white',
                    backgroundColor: Colors.primary,
                    padding: 10,
                    marginVertical: 10,
                    textAlign: 'center',
                    borderRadius: 5,
                }}
                onPress={() => calcularResumoGastos(motoSelecionada, dataInicio, dataFim)}
            >
                Buscar período
            </Text>

            <View>
                <Text style={styles.resumoTitulo}>Resumo do Período</Text>
                <Text style={styles.resumoTexto}>Abastecimentos no período: {qtdAbastecimentos}</Text>
                <Text style={styles.resumoTexto}>Litros abastecidos: {litrosMes.toFixed(2)} L</Text>
                <Text style={styles.resumoTexto}>Gasto com combustível: R$ {gastoCombustivel.toFixed(2)}</Text>
                <Text style={styles.resumoTexto}>Gasto com manutenção: R$ {gastoManutencao.toFixed(2)}</Text>
                <Text style={styles.resumoTexto}>Total gasto no mês (manutenção e combustível): R$ {gastos.toFixed(2)}</Text>
                <Text style={styles.resumoTexto}>Média de consumo: {consumo.toFixed(2)} Km/L</Text>
                <Text style={styles.resumoTexto}>Custo por Km rodado: R$ {custoPorKm.toFixed(2)}</Text>
                <Text style={styles.resumoTexto}>Próxima manutenção: {proximaManutencao}</Text>
            </View>
        </View>
    );
}
