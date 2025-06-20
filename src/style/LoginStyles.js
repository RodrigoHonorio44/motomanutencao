import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 34,
        color: Colors.textPrimary,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        width: width * 0.85,
        backgroundColor: Colors.background,
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 15,
        fontSize: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        color: Colors.textSecondary,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    inputWithIcon: {
        width: width * 0.85,
        backgroundColor: Colors.background,
        borderRadius: 30,
        paddingVertical: 15,
        paddingLeft: 20,
        paddingRight: 15,
        marginBottom: 15,
        fontSize: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        flexDirection: 'row',
        alignItems: 'center',
    },

    button: {
        width: width * 0.85,
        backgroundColor: Colors.button,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: Colors.buttonText,
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupText: {
        color: Colors.textPrimary,
        marginTop: 15,
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    errorText: {
        color: Colors.button,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
    },
});
