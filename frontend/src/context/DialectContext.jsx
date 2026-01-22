
import { createContext, useContext, useState, useEffect } from 'react';

const DialectContext = createContext();

export function useDialect() {
    return useContext(DialectContext);
}

export function DialectProvider({ children }) {
    const [selectedDialect, setSelectedDialect] = useState('eng_Latn');
    const [availableDialects, setAvailableDialects] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial dialects list (fallback)
    const initialDialects = [
        { code: "eng_Latn", name: "English" },
        { code: "hin_Deva", name: "Hindi" },
        { code: "ben_Beng", "name": "Bengali" },
        { code: "tam_Taml", "name": "Tamil" },
        { code: "tel_Telu", "name": "Telugu" },
        { code: "mar_Deva", "name": "Marathi" },
        { code: "bho_Deva", "name": "Bhojpuri" },
    ];

    useEffect(() => {
        // Fetch supported languages from backend
        const fetchLanguages = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/languages');
                if (response.ok) {
                    const data = await response.json();
                    setAvailableDialects(data.languages);
                } else {
                    setAvailableDialects(initialDialects);
                }
            } catch (error) {
                console.error("Failed to fetch languages", error);
                setAvailableDialects(initialDialects);
            }
        };

        fetchLanguages();
    }, []);

    const adaptContent = async (text) => {
        if (!text || selectedDialect === 'eng_Latn') return text;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/adapt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    target_language: selectedDialect,
                    source_language: 'eng_Latn'
                }),
            });

            if (response.ok) {
                const data = await response.json();
                return data.translated_text;
            }
        } catch (error) {
            console.error("Adaptation failed", error);
        } finally {
            setLoading(false);
        }
        return text;
    };

    const value = {
        selectedDialect,
        setSelectedDialect,
        availableDialects,
        adaptContent,
        loading
    };

    return (
        <DialectContext.Provider value={value}>
            {children}
        </DialectContext.Provider>
    );
}
