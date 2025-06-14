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
    titulo: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: Colors.textPrimary,  // Cor do texto do título (branco)
    },
    input: {
        width: width * 0.85, // 85% da largura da tela para responsividade
        backgroundColor: Colors.background,
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 15,
        fontSize: 16,
        elevation: 4, // sombra Android
        shadowColor: '#000', // sombra iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        color: Colors.textSecondary, // Cor do texto dentro do input (preto escuro)
    },
    button: {
        width: width * 0.85,
        backgroundColor: Colors.button,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
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
        color: Colors.buttonText, // Cor do texto do botão (branco)
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        marginTop: 20,
        textDecorationLine: 'underline',
        textAlign: 'center',
        color: Colors.textPrimary, // Cor do texto do link para login (branco)
        fontSize: 16,
    },
    errorText: {
        color: '#FF6B6B', // Vermelho para mensagem de erro
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: '600',
    },
});
