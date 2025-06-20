import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    ActivityIndicator,
    Modal,
    TextInput,
} from 'react-native';
import {
    getAuth,
    onAuthStateChanged,
    signOut,
} from 'firebase/auth';
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    where,
    doc,
    getDoc,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from '../style/HomeStyles';
import Colors from '../style/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
    const auth = getAuth();
    const [usuario, setUsuario] = useState(null);
    const [motoSelecionadaId, setMotoSelecionadaId] = useState(null);

    const [manutencoesRecentes, setManutencoesRecentes] = useState([]);
    const [totalPendentes, setTotalPendentes] = useState(0);
    const [kmTotal, setKmTotal] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modalKmVisible, setModalKmVisible] = useState(false);
    const [modalMotosVisible, setModalMotosVisible] = useState(false);
    const [novoKm, setNovoKm] = useState('');
    const [motosList, setMotosList] = useState([]);
    const [totalMotos, setTotalMotos] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUsuario(user);
        });
        return unsubscribe;
    }, []);

    const fetchMotos = async () => {
        try {
            const motosSnapshot = await getDocs(collection(db, 'motos'));
            const motos = [];
            motosSnapshot.forEach(doc => {
                motos.push({ id: doc.id, ...doc.data() });
            });
            setMotosList(motos);
            setTotalMotos(motos.length);

            if (!motoSelecionadaId && motos.length > 0) {
                setMotoSelecionadaId(motos[0].id);
            }
        } catch (err) {
            console.error('Erro ao buscar motos:', err);
            setError('Erro ao carregar motos.');
        }
    };

    const fetchDadosMotoSelecionada = async motoId => {
        if (!motoId) return;
        setLoading(true);
        setError(null);

        try {
            // KM total da moto
            const motoDoc = await getDoc(doc(db, 'motos', motoId));
            setKmTotal(motoDoc.exists() ? motoDoc.data().kmTotal || 0 : 0);

            // Total de manutenções pendentes dessa moto
            const pendentesQuery = query(
                collection(db, 'manutencoes'),
                where('status', '==', 'pendente'),
                where('motoId', '==', motoId)
            );
            const pendentesSnapshot = await getDocs(pendentesQuery);
            setTotalPendentes(pendentesSnapshot.size);

            // Manutenções recentes de todas as motos (sem filtro por motoId)
            const recentesQuery = query(
                collection(db, 'manutencoes'),
                orderBy('criadoEm', 'desc'),
                limit(5)
            );
            const recentesSnapshot = await getDocs(recentesQuery);
            const manutencoes = [];
            recentesSnapshot.forEach(docSnap => {
                const data = docSnap.data();
                manutencoes.push({
                    id: docSnap.id,
                    tipo: data.tipo || '',
                    data: data.data || '',
                    produto: data.produto || '',
                    valorMaoDeObra: data.valorMaoDeObra || 0,
                    km: data.km || '',
                    motoNome: data.moto || '',
                });
            });
            setManutencoesRecentes(manutencoes);
        } catch (err) {
            console.error('Erro ao carregar dados da moto:', err);
            setError('Erro ao carregar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (motoSelecionadaId) {
            fetchDadosMotoSelecionada(motoSelecionadaId);
        }
    }, [motoSelecionadaId]);

    useEffect(() => {
        fetchMotos();
    }, []);

    const handleAtualizarKm = async () => {
        try {
            const kmNumber = parseInt(novoKm);
            if (isNaN(kmNumber) || kmNumber <= 0) {
                setError('Informe um valor de KM válido.');
                return;
            }

            if (!motoSelecionadaId) {
                setError('Nenhuma moto selecionada.');
                return;
            }

            const motoRef = doc(db, 'motos', motoSelecionadaId);
            await updateDoc(motoRef, { kmTotal: kmNumber });

            setKmTotal(kmNumber);
            setModalKmVisible(false);
            setNovoKm('');
            setError(null);
        } catch (err) {
            console.error('Erro ao atualizar KM:', err);
            setError('Erro ao atualizar o KM.');
        }
    };

    const resumoDados = [
        { id: '1', titulo: 'Motos Cadastradas', valor: totalMotos },
        { id: '2', titulo: 'Manutenções Pendentes', valor: totalPendentes },
        { id: '3', titulo: 'KM Total da Moto', valor: kmTotal },
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace('Login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const handleSelecionarMoto = moto => {
        setMotoSelecionadaId(moto.id);
        setModalMotosVisible(false);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <View
                style={[
                    styles.header,
                    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
                ]}
            >
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ padding: 10 }}>
                    <Ionicons name="menu" size={30} color={Colors.textPrimary} />
                </TouchableOpacity>

                <Text style={styles.logo}>MotoManutenção</Text>

                <TouchableOpacity onPress={handleLogout} style={{ padding: 8 }}>
                    <Ionicons name="log-out-outline" size={28} color="red" />
                </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />}

            {error && (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
            )}

            {!loading && !error && (
                <>
                    <View style={styles.resumoContainer}>
                        {resumoDados.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.cardResumo}
                                onPress={() => {
                                    if (item.id === '1') {
                                        fetchMotos();
                                        setModalMotosVisible(true);
                                    }
                                    if (item.id === '3') setModalKmVisible(true);
                                }}
                            >
                                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                                <Text style={styles.cardValor}>{item.valor}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Manutenções Recentes</Text>

                    <FlatList
                        data={manutencoesRecentes}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.cardManutencao}>
                                <Text style={styles.motoNome}>Moto: {item.motoNome}</Text>
                                <Text>Tipo: {item.tipo}</Text>
                                <Text>Data: {item.data}</Text>
                                <Text>Produto: {item.produto}</Text>
                                <Text>KM: {item.km}</Text>
                                <Text>Mão de Obra: R$ {item.valorMaoDeObra}</Text>
                            </View>
                        )}
                        scrollEnabled={false}
                    />
                </>
            )}

            {/* Modal para atualizar o KM */}
            <Modal
                visible={modalKmVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalKmVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#fff',
                            padding: 20,
                            borderRadius: 10,
                            width: '100%',
                            maxWidth: 300,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                            Atualizar KM Total
                        </Text>
                        <TextInput
                            placeholder="Novo KM"
                            keyboardType="numeric"
                            value={novoKm}
                            onChangeText={setNovoKm}
                            style={{
                                borderColor: '#ccc',
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 8,
                                marginBottom: 15,
                            }}
                        />
                        <TouchableOpacity
                            onPress={handleAtualizarKm}
                            style={{
                                backgroundColor: Colors.primary,
                                padding: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Salvar KM</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setModalKmVisible(false)}
                            style={{ marginTop: 10, alignItems: 'center' }}
                        >
                            <Text style={{ color: Colors.textPrimary }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de seleção de Moto */}
            <Modal
                visible={modalMotosVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalMotosVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#fff',
                            padding: 20,
                            borderRadius: 10,
                            width: '100%',
                            maxWidth: 300,
                            maxHeight: '80%',
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                            Selecione uma Moto
                        </Text>
                        <FlatList
                            data={motosList}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelecionarMoto(item)}
                                    style={{
                                        padding: 10,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#ccc',
                                    }}
                                >
                                    <Text>{`${item.marca} ${item.modelo} - ${item.placa}`}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            onPress={() => setModalMotosVisible(false)}
                            style={{ marginTop: 10, alignItems: 'center' }}
                        >
                            <Text style={{ color: Colors.textPrimary }}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
