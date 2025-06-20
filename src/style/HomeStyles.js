import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';  // Continua a importação de Colors

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

    profileIcon: {
        padding: 5,
    },

    resumoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',            // Permite quebra de linha
        justifyContent: 'space-between',
        marginBottom: 30,
    },

    cardResumo: {
        backgroundColor: '#fff',
        width: (width - 80) / 3,     // Para caber 3 por linha com espaçamento
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
    },

    cardManutencao: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
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

    /** MODAL - Atualização de KM **/
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
