import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        backgroundColor: Colors.background,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.textSecondary,
    },
    button: {
        backgroundColor: Colors.button,
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: Colors.buttonText,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
