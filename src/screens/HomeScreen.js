import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';  // importando ícone
import styles from '../style/HomeStyles';
import Colors from '../style/Colors';

const resumoDados = [
    { id: '1', titulo: 'Motos Cadastradas', valor: 8 },
    { id: '2', titulo: 'Manutenções Pendentes', valor: 3 },
    { id: '3', titulo: 'Próxima Revisão', valor: '15/07/2025' },
];

const manutencoesRecentes = [
    { id: 'm1', moto: 'Honda CG 150', tipo: 'Troca de óleo', data: '01/06/2025' },
    { id: 'm2', moto: 'Yamaha Lander', tipo: 'Revisão geral', data: '28/05/2025' },
    { id: 'm3', moto: 'Honda Biz', tipo: 'Troca de pastilha de freio', data: '25/05/2025' },
];

export default function HomeScreen({ navigation }) {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <View style={styles.header}>
                <Text style={styles.logo}>MotoManutenção</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
                    {/* Ícone de perfil usando MaterialIcons */}
                    <MaterialIcons name="person" size={40} color={Colors.secondary} />
                </TouchableOpacity>
            </View>

            {/* Cards resumo */}
            <View style={styles.resumoContainer}>
                {resumoDados.map(item => (
                    <View key={item.id} style={styles.cardResumo}>
                        <Text style={styles.cardTitulo}>{item.titulo}</Text>
                        <Text style={styles.cardValor}>{item.valor}</Text>
                    </View>
                ))}
            </View>

            {/* Seção manutenções recentes */}
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
                scrollEnabled={false} // desabilita o scroll interno pra não conflitar com ScrollView pai
            />

            {/* Botões principais */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('CadastroMoto')}
                >
                    <Text style={styles.primaryButtonText}>Cadastrar Moto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('RegistrarManutencao')}
                >
                    <Text style={styles.secondaryButtonText}>Registrar Manutenção</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
