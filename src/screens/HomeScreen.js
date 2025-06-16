import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Modal, TextInput } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy, limit, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from '../style/HomeStyles';
import Colors from '../style/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
    const auth = getAuth();
    const [usuario, setUsuario] = useState(null);
    const [manutencoesRecentes, setManutencoesRecentes] = useState([]);
    const [totalMotos, setTotalMotos] = useState(0);
    const [totalPendentes, setTotalPendentes] = useState(0);
    const [kmTotal, setKmTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [novoKm, setNovoKm] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUsuario(user);
        });
        return unsubscribe;
    }, []);

    const fetchResumoDados = async () => {
        setLoading(true);
        setError(null);
        try {
            // Total motos
            const motosSnapshot = await getDocs(collection(db, 'motos'));
            setTotalMotos(motosSnapshot.size);

            // Carregar o KM total da primeira moto (exemplo: moto de id "moto1" - ajuste conforme sua estrutura)
            const motos = [];
            motosSnapshot.forEach((doc) => {
                motos.push({ id: doc.id, ...doc.data() });
            });
            if (motos.length > 0) {
                setKmTotal(motos[0].kmTotal || 0);  // Aqui pega o kmTotal da primeira moto
            }

            // Total manutenções pendentes
            const pendentesQuery = query(collection(db, 'manutencoes'), where('status', '==', 'pendente'));
            const pendentesSnapshot = await getDocs(pendentesQuery);
            setTotalPendentes(pendentesSnapshot.size);

            // Manutenções recentes
            const recentesQuery = query(collection(db, 'manutencoes'), orderBy('criadoEm', 'desc'), limit(5));
            const recentesSnapshot = await getDocs(recentesQuery);
            const manutencoes = [];
            recentesSnapshot.forEach((doc) => {
                manutencoes.push({ id: doc.id, ...doc.data() });
            });
            setManutencoesRecentes(manutencoes);

        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            setError('Erro ao carregar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumoDados();
    }, []);

    const handleAtualizarKm = async () => {
        try {
            const kmNumber = parseInt(novoKm);
            if (isNaN(kmNumber) || kmNumber <= 0) {
                setError('Informe um valor de KM válido.');
                return;
            }

            const motosSnapshot = await getDocs(collection(db, 'motos'));
            if (motosSnapshot.empty) return;

            const motoDoc = motosSnapshot.docs[0]; // Exemplo: atualizando a primeira moto
            const motoRef = doc(db, 'motos', motoDoc.id);

            await updateDoc(motoRef, { kmTotal: kmNumber });

            setKmTotal(kmNumber);
            setModalVisible(false);
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

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ padding: 10 }}>
                    <Ionicons name="menu" size={30} color={Colors.textPrimary} />
                </TouchableOpacity>

                <Text style={styles.logo}>MotoManutenção</Text>

                <TouchableOpacity onPress={handleLogout} style={{ padding: 8 }}>
                    <Ionicons name="log-out-outline" size={28} color="red" />
                </TouchableOpacity>
            </View>

            {loading && (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
            )}

            {error && (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
                    {error}
                </Text>
            )}

            {!loading && !error && (
                <>
                    <View style={styles.resumoContainer}>
                        {resumoDados.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.cardResumo}
                                onPress={() => {
                                    if (item.id === '3') setModalVisible(true); // Só abre o modal no KM
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
                                <Text style={styles.motoNome}>{item.moto}</Text>
                                <Text style={styles.manutencaoTipo}>{item.tipo}</Text>
                                <Text style={styles.manutencaoData}>{item.data}</Text>
                            </View>
                        )}
                        scrollEnabled={false}
                    />
                </>
            )}

            {/* Modal para atualizar o KM */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        padding: 20,
                        borderRadius: 10,
                        width: '100%',
                        maxWidth: 300,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Atualizar KM Total</Text>
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
                            onPress={() => setModalVisible(false)}
                            style={{ marginTop: 10, alignItems: 'center' }}
                        >
                            <Text style={{ color: Colors.textPrimary }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
