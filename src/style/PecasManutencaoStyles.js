import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
    container: {
        // Flex para ocupar toda a tela no container pai (View)
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
    },

    // Este estilo é para o contentContainerStyle do FlatList
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
        flexGrow: 1,
        backgroundColor: Colors.background,
    },

    card: {
        backgroundColor: Colors.cardBackground,
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    cardTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 6,
    },

    cardLabel: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 6,
        color: Colors.textPrimary,
    },

    cardTexto: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 4,
    },

    cardAlerta: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff3cd',
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
        color: '#856404',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 'bold',
    },

    divisor: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },

    // Mantendo os nomes antigos se outras telas usarem
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 6,
    },

    descricao: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 6,
    },

    info: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 4,
    },

    alerta: {
        fontSize: 14,
        color: 'red',
        fontWeight: 'bold',
        marginTop: 8,
    },
});
