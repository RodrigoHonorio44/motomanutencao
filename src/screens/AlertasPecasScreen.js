import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from '../style/PecasManutencaoStyles'; // seu styles de peças

export default function AlertasPecasScreen({ route }) {
    const { pecasComAlerta } = route.params;

    if (!pecasComAlerta || pecasComAlerta.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma peça próxima do vencimento.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={pecasComAlerta}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.titulo}>{item.nome}</Text>
                    <Text style={styles.descricao}>{item.descricao}</Text>
                    <Text style={styles.info}>
                        Última troca: {item.ultimaTrocaKm} KM
                        {item.ultimaTrocaData ? ` em ${item.ultimaTrocaData.toLocaleDateString()}` : ' (Sem registro)'}
                    </Text>
                    <Text style={styles.info}>
                        Próxima troca: {item.proximaTrocaKm} KM
                        {item.dataProximaTroca ? ` ou até ${item.dataProximaTroca.toLocaleDateString()}` : ''}
                    </Text>
                    {item.alertaKm && <Text style={styles.alerta}>⚠️ Próximo da troca por KM</Text>}
                    {item.alertaTempo && <Text style={styles.alerta}>⚠️ Próximo da troca por Tempo</Text>}
                    <Text style={styles.observacoes}>Observações: {item.observacoes}</Text>
                </View>
            )}
        />
    );
}
