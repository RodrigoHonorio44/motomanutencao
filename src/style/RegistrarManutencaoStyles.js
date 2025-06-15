import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9fb',
        paddingHorizontal: 20,
        paddingTop: 40,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000367',
        textAlign: 'center',
        marginBottom: 30,
    },

    input: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        color: '#333',
    },

    picker: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 15,
        height: 50,
        justifyContent: 'center',
        // No Android, o Picker usa altura fixa, mas para iOS, você pode precisar ajustar a fonte com itemStyle no componente
    },

    dateInput: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        justifyContent: 'center',
        height: 50,
    },

    saveButton: {
        backgroundColor: '#6A3093',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 5,
        marginTop: 10,
    },

    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#e0e0e0', // cinza claro neutro
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 15, // espaçamento para separar do botão Salvar
    },

    backButtonText: {
        color: '#333', // texto escuro para boa leitura
        fontSize: 16,
        fontWeight: 'bold',
    },

});
