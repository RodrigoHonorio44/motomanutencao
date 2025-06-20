import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        color: Colors.text,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: Colors.buttonText,
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',         // para evitar borda cortando no Android
        backgroundColor: Colors.background,  // fundo igual container para melhor visual
    },
    picker: {
        height: 50,
        color: Colors.text,
        // no iOS o picker tem estilo próprio, no Android essa cor funciona
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.subtitle,
        marginVertical: 12,
    },
    item: {
        backgroundColor: Colors.itemBackground,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
});
