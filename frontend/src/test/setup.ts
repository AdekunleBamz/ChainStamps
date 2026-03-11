import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value.toString(); }),
        clear: vi.fn(() => { store = {}; }),
        removeItem: vi.fn((key: string) => { delete store[key]; })
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock crypto
Object.defineProperty(window, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid',
        subtle: {
            digest: vi.fn()
        }
    }
});
