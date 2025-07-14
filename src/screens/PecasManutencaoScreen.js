import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Colors from '../style/Colors';
import styles from '../style/PecasManutencaoStyles';

export default function PecasManutencaoScreen({ route }) {
    const { motoId, kmAtual: kmAtualParam } = route.params || {};
    // Garante que kmAtual seja número
    const kmAtual = Number(kmAtualParam) || 0;

    const [pecas, setPecas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!motoId) {
            setLoading(false);
            return;
        }

        const fetchPecas = async () => {
            try {
                const pecasSnapshot = await getDocs(collection(db, 'pecas_manutencao'));
                const pecasList = [];

                for (const docPeca of pecasSnapshot.docs) {
                    const peca = { id: docPeca.id, ...docPeca.data() };

                    const manutQuery = query(
                        collection(db, 'manutencoes'),
                        where('motoId', '==', motoId),
                        where('tipo', '==', peca.nome),
                        orderBy('criadoEm', 'desc'),
                        limit(1)
                    );

                    const manutSnapshot = await getDocs(manutQuery);
                    let ultimaTrocaKm = 0;
                    let ultimaTrocaData = null;

                    if (!manutSnapshot.empty) {
                        const ultimaManut = manutSnapshot.docs[0].data();
                        ultimaTrocaKm = ultimaManut.km || 0;

                        if (ultimaManut.criadoEm?.toDate) {
                            ultimaTrocaData = ultimaManut.criadoEm.toDate();
                        }
                    }

                    // Trata vida_km nulo ou 0 (ex.: bateria)
                    const proximaTrocaKm = peca.vida_km ? ultimaTrocaKm + peca.vida_km : null;

                    const dataProximaTroca = ultimaTrocaData
                        ? new Date(
                            ultimaTrocaData.getFullYear(),
                            ultimaTrocaData.getMonth() + (peca.vida_meses || 0),
                            ultimaTrocaData.getDate()
                        )
                        : null;

                    let alerta = '';

                    if (proximaTrocaKm !== null && kmAtual >= proximaTrocaKm - 500) {
                        alerta += '⚠️ Próximo da troca por KM! ';
                    }

                    if (dataProximaTroca) {
                        const hoje = new Date();
                        const diasRestantes = (dataProximaTroca - hoje) / (1000 * 60 * 60 * 24);
                        if (diasRestantes <= 30) {
                            alerta += '⚠️ Próximo da troca por Tempo!';
                        }
                    }

                    alerta = alerta.trim();

                    pecasList.push({
                        ...peca,
                        ultimaTrocaKm,
                        ultimaTrocaData,
                        proximaTrocaKm,
                        dataProximaTroca,
                        alerta,
                    });
                }

                setPecas(pecasList);
            } catch (error) {
                console.error('Erro ao buscar peças:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPecas();
    }, [motoId, kmAtual]);

    if (loading) {
        return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />;
    }

    if (!motoId) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Nenhuma moto selecionada.</Text>
            </View>
        );
    }

    return (
        // IMPORTANTÍSSIMO: O container pai TEM que ter flex: 1
        <View style={{ flex: 1 }}>
            <FlatList
                data={pecas}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitulo}>{item.nome}</Text>

                        <View style={styles.divisor} />

                        <Text style={styles.cardLabel}>Vida útil:</Text>
                        <Text style={styles.cardTexto}>
                            {item.vida_km ?? 'N/A'} KM ou {item.vida_meses} meses
                        </Text>

                        <Text style={styles.cardLabel}>Última troca:</Text>
                        <Text style={styles.cardTexto}>
                            {item.ultimaTrocaKm} KM
                            {item.ultimaTrocaData
                                ? ` em ${item.ultimaTrocaData.toLocaleDateString()}`
                                : ' (Sem registro)'}
                        </Text>

                        <Text style={styles.cardLabel}>Próxima troca:</Text>
                        <Text style={styles.cardTexto}>
                            {item.proximaTrocaKm ?? 'N/A'} KM
                            {item.dataProximaTroca
                                ? ` ou até ${item.dataProximaTroca.toLocaleDateString()}`
                                : ''}
                        </Text>

                        {item.alerta ? <Text style={styles.cardAlerta}>{item.alerta}</Text> : null}
                    </View>
                )}
            />
        </View>
    );
}
