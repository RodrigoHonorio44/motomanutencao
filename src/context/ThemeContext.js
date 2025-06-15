// src/context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native'; // Para detectar tema do sistema

// Temas definidos separados (você pode importar de arquivos separados também)
const themes = {
    light: {
        primary: '#000367',
        secondary: '#6A3093',
        background: '#fff',
        textPrimary: '#000',
        button: '#FF6B6B',
        buttonText: '#fff',
        placeholder: '#aaa',
        // ... adicione mais cores conforme necessário
    },
    dark: {
        primary: '#000',
        secondary: '#6A3093',
        background: '#121212',
        textPrimary: '#fff',
        button: '#FF6B6B',
        buttonText: '#fff',
        placeholder: '#888',
        // ... adicione mais cores para o modo escuro
    },
};

export const ThemeContext = createContext({
    theme: themes.light,
    toggleTheme: () => { },
    isDark: false,
});

export function ThemeProvider({ children }) {
    // Detecta o tema do sistema inicialmente
    const colorScheme = Appearance.getColorScheme();
    const [isDark, setIsDark] = useState(colorScheme === 'dark');

    // Alterna entre claro e escuro
    const toggleTheme = () => {
        setIsDark((prev) => !prev);
    };

    // Atualiza o tema caso o usuário mude o tema do sistema (opcional)
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setIsDark(colorScheme === 'dark');
        });
        return () => subscription.remove();
    }, []);

    const theme = isDark ? themes.dark : themes.light;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}
