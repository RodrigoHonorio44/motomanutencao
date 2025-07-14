import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Modal,
    TextInput,
    Alert,
    Animated,
} from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
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
    const [consumoMedio, setConsumoMedio] = useState(null);
    const [error, setError] = useState(null);

    const [modalKmVisible, setModalKmVisible] = useState(false);
    const [modalMotosVisible, setModalMotosVisible] = useState(false);
    const [novoKm, setNovoKm] = useState('');
    const [motosList, setMotosList] = useState([]);
    const [loadingMotos, setLoadingMotos] = useState(true);
    const [loadingDadosMoto, setLoadingDadosMoto] = useState(false);

    // Para piscar o texto do alerta troca óleo
    const piscarAnim = useRef(new Animated.Value(1)).current;

    // Estado do alerta de troca óleo
    const [kmRestanteTrocaOleo, setKmRestanteTrocaOleo] = useState('Carregando...');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUsuario(user);
        });
        return unsubscribe;
    }, []);

    const fetchMotos = async () => {
        setLoadingMotos(true);
        try {
            const motosSnapshot = await getDocs(collection(db, 'motos'));
            const motos = [];
            motosSnapshot.forEach(doc => {
                motos.push({ id: doc.id, ...doc.data() });
            });
            setMotosList(motos);
            if (!motoSelecionadaId && motos.length > 0) {
                setMotoSelecionadaId(motos[0].id);
            }
        } catch (err) {
            console.error('Erro ao buscar motos:', err);
            setError('Erro ao carregar motos.');
        } finally {
            setLoadingMotos(false);
        }
    };

    // Atualizado: retorna kmTotal para usar no efeito
    const fetchDadosMotoSelecionada = async (motoId) => {
        if (!motoId) return 0;
        setLoadingDadosMoto(true);
        setError(null);
        try {
            const motoDoc = await getDoc(doc(db, 'motos', motoId));
            const km = motoDoc.exists() ? motoDoc.data().kmtotal || 0 : 0;

            const pendentesQuery = query(
                collection(db, 'manutencoes'),
                where('status', '==', 'pendente'),
                where('motoId', '==', motoId)
            );
            const pendentesSnapshot = await getDocs(pendentesQuery);
            setTotalPendentes(pendentesSnapshot.size);

            const recentesQuery = query(
                collection(db, 'manutencoes'),
                where('motoId', '==', motoId),
                orderBy('criadoEm', 'desc'),
                limit(5)
            );
            const recentesSnapshot = await getDocs(recentesQuery);

            const manutencoes = [];
            recentesSnapshot.forEach(docSnap => {
                const data = docSnap.data();
                const moto = motosList.find(m => m.id === motoId) || {};
                manutencoes.push({
                    id: docSnap.id,
                    tipo: data.tipo || '',
                    data: data.data || '',
                    produto: data.produto || '',
                    valorProduto: data.valorProduto || 0,
                    valorMaoDeObra: data.valorMaoDeObra || 0,
                    km: data.km || '',
                    motoNome: moto.marca && moto.modelo ? `${moto.marca} ${moto.modelo}` : '',
                    motoPlaca: moto.placa || '',
                });
            });

            setManutencoesRecentes(manutencoes);
            setKmTotal(km);

            return km; // Retorna o km para ser usado logo após
        } catch (err) {
            console.error('Erro ao carregar dados da moto:', err);
            setError('Erro ao carregar dados. Tente novamente.');
            return 0;
        } finally {
            setLoadingDadosMoto(false);
        }
    };

    const calcularConsumoMedio = async (motoId) => {
        try {
            const abastecimentosRef = collection(db, 'abastecimentos');
            const q = query(
                abastecimentosRef,
                where('motoId', '==', motoId),
                orderBy('data', 'desc'),
                limit(10)
            );
            const snapshot = await getDocs(q);

            const abastecimentos = [];
            snapshot.forEach(doc => abastecimentos.push(doc.data()));

            if (abastecimentos.length < 2) return null;

            abastecimentos.reverse();

            const kmInicial = abastecimentos[0].kmAtual || 0;
            const kmFinal = abastecimentos[abastecimentos.length - 1].kmAtual || 0;
            const kmRodados = kmFinal - kmInicial;
            if (kmRodados <= 0) return null;

            const litrosTotal = abastecimentos.slice(1).reduce((total, a) => total + (a.litros || 0), 0);
            if (litrosTotal === 0) return null;

            const consumo = kmRodados / litrosTotal;
            return consumo.toFixed(2);
        } catch (error) {
            console.error('Erro ao calcular consumo médio:', error);
            return null;
        }
    };

    // Busca o próximo alerta de troca de óleo e calcula km restante
    const fetchProximaTrocaOleo = async (motoId, kmAtualMoto) => {
        try {
            // Buscando a manutenção do tipo 'Óleo do motor' mais recente
            const q = query(
                collection(db, 'manutencoes'),
                where('motoId', '==', motoId),
                where('tipo', '==', 'Óleo do motor'),
                orderBy('km', 'desc'),
                limit(1)
            );
            const snapshot = await getDocs(q);
            if (snapshot.empty) {
                setKmRestanteTrocaOleo('Nenhum alerta');
                stopPiscar();
                return;
            }
            const manut = snapshot.docs[0].data();
            const kmManut = manut.km || 0;

            // Supondo troca de óleo a cada 3000 km
            const intervaloTroca = 3000;

            let kmRestante = kmManut + intervaloTroca - kmAtualMoto;

            if (kmRestante <= 0) {
                setKmRestanteTrocaOleo('TROCAR AGORA!');
                startPiscar();
            } else {
                setKmRestanteTrocaOleo(`em ${kmRestante} km`);
                stopPiscar();
            }
        } catch (error) {
            console.error('Erro ao buscar troca de óleo:', error);
            setKmRestanteTrocaOleo('Erro ao buscar alerta');
            stopPiscar();
        }
    };

    // Piscar animação
    const startPiscar = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(piscarAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(piscarAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const stopPiscar = () => {
        piscarAnim.stopAnimation();
        piscarAnim.setValue(1);
    };

    // Atualizado: uso só 1 useEffect para buscar dados e depois alerta
    useEffect(() => {
        fetchMotos();
    }, []);

    useEffect(() => {
        if (motoSelecionadaId) {
            fetchDadosMotoSelecionada(motoSelecionadaId).then((km) => {
                calcularConsumoMedio(motoSelecionadaId).then(setConsumoMedio);
                fetchProximaTrocaOleo(motoSelecionadaId, km);
            });
        }
    }, [motoSelecionadaId]);

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
            await updateDoc(doc(db, 'motos', motoSelecionadaId), { kmtotal: kmNumber });
            setKmTotal(kmNumber);
            setModalKmVisible(false);
            setNovoKm('');
            setError(null);
            Alert.alert('Sucesso', 'KM atualizado com sucesso!');
        } catch (err) {
            console.error('Erro ao atualizar KM:', err);
            setError('Erro ao atualizar o KM.');
        }
    };

    const formatarData = (data) => {
        if (!data) return '';
        if (typeof data === 'string') return data;
        if (data.seconds) return new Date(data.seconds * 1000).toLocaleDateString('pt-BR');
        if (data.toDate) return data.toDate().toLocaleDateString('pt-BR');
        return '';
    };

    const resumoDados = [
        { id: '1', titulo: 'Motos Cadastradas', valor: motosList.length },
        { id: '2', titulo: 'Manutenções Pendentes', valor: totalPendentes },
        { id: '3', titulo: 'KM Total da Moto', valor: kmTotal },
        { id: '4', titulo: 'Alertas de Peças', valor: '' },
        { id: '5', titulo: 'Consumo Médio (km/l)', valor: consumoMedio ? `${consumoMedio} km/l` : 'N/A' },
        {
            id: '6',
            titulo: 'Próxima Troca de Óleo',
            valor: kmRestanteTrocaOleo,
            piscar: kmRestanteTrocaOleo === 'TROCAR AGORA!',
        },
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

    if (loadingMotos || loadingDadosMoto) {
        return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />;
    }

    return (
        <>
            <FlatList
                data={manutencoesRecentes}
                keyExtractor={item => item.id}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ padding: 10 }}>
                                <Ionicons name="menu" size={30} color={Colors.textPrimary} />
                            </TouchableOpacity>
                            <Text style={styles.logo}>MotoManutenção</Text>
                            <TouchableOpacity onPress={handleLogout} style={{ padding: 8 }}>
                                <Ionicons name="log-out-outline" size={28} color="red" />
                            </TouchableOpacity>
                        </View>

                        {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>}

                        <View style={styles.resumoContainer}>
                            {resumoDados.map(item => {
                                const isPiscar = item.piscar;
                                if (item.id === '6') {
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={[
                                                styles.cardResumo,
                                                isPiscar && {
                                                    backgroundColor: '#ffcccc',
                                                    borderWidth: 1,
                                                    borderColor: 'red',
                                                },
                                            ]}
                                            onPress={() => {
                                                if (isPiscar) {
                                                    Alert.alert('Atenção', 'É hora de trocar o óleo da moto!');
                                                }
                                            }}
                                        >
                                            <Animated.Text
                                                style={[
                                                    styles.cardValor,
                                                    isPiscar && { opacity: piscarAnim },
                                                ]}
                                            >
                                                {item.valor}
                                            </Animated.Text>
                                            <Text style={styles.cardTitulo}>{item.titulo}</Text>
                                        </TouchableOpacity>
                                    );
                                }

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.cardResumo}
                                        onPress={() => {
                                            if (item.id === '1') {
                                                fetchMotos();
                                                setModalMotosVisible(true);
                                            }
                                            if (item.id === '3') setModalKmVisible(true);
                                            if (item.id === '4') {
                                                if (!motoSelecionadaId) {
                                                    Alert.alert('Atenção', 'Selecione uma moto primeiro.');
                                                    return;
                                                }
                                                navigation.navigate('Peças Manutenção', {
                                                    motoId: motoSelecionadaId,
                                                    kmAtual: kmTotal,
                                                });
                                            }
                                        }}
                                    >
                                        <Text style={styles.cardTitulo}>{item.titulo}</Text>
                                        <Text style={styles.cardValor}>{item.valor}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={styles.sectionTitle}>Manutenções Recentes</Text>
                    </>
                }
                renderItem={({ item }) => (
                    <View style={styles.cardManutencao}>
                        <Text style={styles.motoNome}>Moto: {item.motoNome} - Placa: {item.motoPlaca}</Text>
                        <Text>Tipo: {item.tipo}</Text>
                        <Text>Data: {formatarData(item.data)}</Text>
                        <Text>Produto: {item.produto}</Text>
                        <Text>Valor do Produto: R$ {Number(item.valorProduto).toFixed(2)}</Text>
                        <Text>KM: {item.km}</Text>
                        <Text>Mão de Obra: R$ {item.valorMaoDeObra.toFixed(2)}</Text>
                    </View>
                )}
                ListFooterComponent={<View style={{ height: 30 }} />}
            />

            {/* Modal KM */}
            <Modal visible={modalKmVisible} transparent animationType="slide" onRequestClose={() => setModalKmVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Atualizar KM Total</Text>
                        <TextInput
                            placeholder="Novo KM"
                            keyboardType="numeric"
                            value={novoKm}
                            onChangeText={setNovoKm}
                            style={styles.modalInput}
                        />
                        <TouchableOpacity onPress={handleAtualizarKm} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Salvar KM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalKmVisible(false)} style={styles.modalCancel}>
                            <Text style={styles.modalCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Motos */}
            <Modal visible={modalMotosVisible} transparent animationType="slide" onRequestClose={() => setModalMotosVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { maxHeight: '80%' }]}>
                        <Text style={styles.modalTitle}>Selecione uma Moto</Text>
                        <FlatList
                            data={motosList}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelecionarMoto(item)}
                                    style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
                                >
                                    <Text>{`${item.marca} ${item.modelo} - ${item.placa}`}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setModalMotosVisible(false)} style={styles.modalCancel}>
                            <Text style={styles.modalCancelText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}
