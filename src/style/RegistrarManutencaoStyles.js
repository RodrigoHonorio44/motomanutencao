import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f9f9fb',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000367',
        textAlign: 'center',
        marginBottom: 30,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
        // sombra para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // elevação para Android
        elevation: 4,
    },

    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000367',
        marginBottom: 6,
    },

    descricao: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },

    info: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },

    alerta: {
        fontSize: 14,
        color: '#D32F2F', // vermelho vibrante para alerta
        fontWeight: 'bold',
        marginTop: 8,
    },

    // Estilos para botões
    saveButton: {
        backgroundColor: '#000367',    // azul escuro
        paddingVertical: 14,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },

    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    backButton: {
        backgroundColor: '#000367',    // mesmo azul pra igualar visual
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },

    backButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
