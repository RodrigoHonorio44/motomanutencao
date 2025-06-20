import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig'; // ajuste o caminho para seu arquivo de config

export default function ManutencoesRecentes({ motoId }) {
    const [manutencoes, setManutencoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchManutencoes() {
            setLoading(true);
            try {
                // Consulta Firestore com filtro e ordenação
                const q = query(
                    collection(db, 'manutencoes'),
                    where('motoId', '==', motoId),
                    orderBy('criadoEm', 'desc'),
                    limit(5)
                );

                const querySnapshot = await getDocs(q);
                const lista = [];
                querySnapshot.forEach(doc => {
                    lista.push({ id: doc.id, ...doc.data() });
                });
                setManutencoes(lista);
            } catch (error) {
                console.error('Erro ao buscar manutenções:', error);
            } finally {
                setLoading(false);
            }
        }

        if (motoId) {
            fetchManutencoes();
        }
    }, [motoId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (manutencoes.length === 0) {
        return <Text>Nenhuma manutenção recente encontrada.</Text>;
    }

    return (
        <FlatList
            data={manutencoes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                    <Text>Tipo: {item.tipo}</Text>
                    <Text>Data: {item.data}</Text>
                    <Text>KM: {item.km}</Text>
                    <Text>Produto: {item.produto}</Text>
                    <Text>Mão de Obra: R$ {item.valorMaoDeObra}</Text>
                </View>
            )}
        />
    );
}
