import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' }
];

export const LanguageProvider = ({ children }) => {
    // Get language from localStorage or default to 'en'
    const [currentLang, setCurrentLang] = useState(() => {
        return localStorage.getItem('vaidyaai_language') || 'en';
    });

    // Save language to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('vaidyaai_language', currentLang);
    }, [currentLang]);

    const changeLanguage = (langCode) => {
        setCurrentLang(langCode);
    };

    const value = {
        currentLang,
        changeLanguage,
        languages
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
