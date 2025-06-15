// src/style/PerfilStyles.js
import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: Colors.primary,
        overflow: 'hidden', // <== Essencial para Android cortar a imagem no círculo
    },
    alterarFotoText: {
        textAlign: 'center',
        color: Colors.secondary,
        marginTop: 8,
        fontWeight: '600',
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: 6,
        paddingHorizontal: 10,
        marginBottom: 12,
        fontSize: 16,
        color: Colors.textSecondary,
    },
    email: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.button,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 6,
    },
    buttonText: {
        color: Colors.buttonText,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
