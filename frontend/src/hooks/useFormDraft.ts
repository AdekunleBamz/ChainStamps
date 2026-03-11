import { useState, useEffect } from 'react';

/**
 * Hook to persist form state in localStorage.
 * @param key The storage key
 * @param initialValue The initial state
 */
export function useFormDraft<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        const saved = localStorage.getItem(`draft_${key}`);
        return saved ? JSON.parse(saved) : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(`draft_${key}`, JSON.stringify(value));
    }, [key, value]);

    const clearDraft = () => {
        localStorage.removeItem(`draft_${key}`);
        setValue(initialValue);
    };

    return [value, setValue, clearDraft] as const;
}
