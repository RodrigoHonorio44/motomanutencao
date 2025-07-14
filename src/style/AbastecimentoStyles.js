import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
    container: {
        flexGrow: 1, // ✅ Essencial para ScrollView funcionar corretamente
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
        overflow: 'hidden',
        backgroundColor: Colors.background,
    },
    picker: {
        height: 50,
        color: Colors.text,
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
