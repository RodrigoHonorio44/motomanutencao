import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9fb',
        paddingHorizontal: 20,
        paddingTop: 40,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },

    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000367',
    },

    // Como é um ícone, só mantenha o tamanho aqui para margem ou clique
    profileIcon: {
        // Se quiser, pode manter algum padding ou margem para área clicável
        // por exemplo:
        // padding: 5,
    },

    resumoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },

    cardResumo: {
        backgroundColor: '#fff',
        width: (width - 60) / 3, // 3 cards com espaçamento
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
    },

    cardTitulo: {
        fontSize: 14,
        color: '#6a3093',
        marginBottom: 10,
    },

    cardValor: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000367',
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },

    cardManutencao: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },

    motoNome: {
        fontWeight: '700',
        fontSize: 16,
        color: '#000367',
    },

    manutencaoTipo: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },

    manutencaoData: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },

    buttonsContainer: {
        marginTop: 30,
        marginBottom: 10,
    },

    primaryButton: {
        backgroundColor: '#6A3093',
        paddingVertical: 15,
        borderRadius: 30,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 5,
    },

    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    secondaryButton: {
        borderWidth: 2,
        borderColor: '#6A3093',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
    },

    secondaryButtonText: {
        color: '#6A3093',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
