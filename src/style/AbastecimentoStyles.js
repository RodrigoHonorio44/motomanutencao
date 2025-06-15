import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
        backgroundColor: Colors.inputBackground,  // caso queira controlar o fundo
    },
    picker: {
        height: 50,
        width: '100%',
        color: Colors.textSecondary,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: Colors.inputBorder,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: Colors.textSecondary, // Cor do texto digitado
    },
    button: {
        backgroundColor: Colors.secondary,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
    },
    buttonText: {
        color: Colors.buttonText,
        fontSize: 18,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 18,
        color: Colors.textSecondary,
        marginBottom: 10,
        textAlign: 'center',
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
});
