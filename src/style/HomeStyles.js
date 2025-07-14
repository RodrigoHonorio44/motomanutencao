import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';

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
        backgroundColor: '#f9f9fb',
        elevation: 0, // Remove sombra Android
        shadowColor: 'transparent', // Remove sombra iOS
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
    },

    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000367',
    },

    profileIcon: {
        padding: 5,
    },

    resumoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginBottom: 30,
    },

    cardResumo: {
        backgroundColor: '#fff',
        width: (width - 56) / 2,
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 6,
        alignItems: 'center',
        marginBottom: 15,
    },

    cardTitulo: {
        fontSize: 14,
        color: '#6a3093',
        marginBottom: 10,
        textAlign: 'center',
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
        textAlign: 'center',
    },

    cardManutencao: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        marginHorizontal: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: Colors.primary,
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

    alerta: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: 8,
    },

    cardAlertaTexto: {
        marginTop: 6,
        color: 'red',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
    },

    observacoes: {
        fontSize: 12,
        color: '#777',
        marginTop: 8,
        fontStyle: 'italic',
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

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.primary,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxWidth: 300,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: Colors.textPrimary,
    },

    modalInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },

    modalButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },

    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    modalCancel: {
        marginTop: 10,
        alignItems: 'center',
    },

    modalCancelText: {
        color: Colors.textPrimary,
    },
});
