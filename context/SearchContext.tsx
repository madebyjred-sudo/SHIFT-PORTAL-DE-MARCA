import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { searchService, SearchResult } from '../services/searchService';

interface SearchContextType {
    query: string;
    results: SearchResult[];
    isSearching: boolean;
    setQuery: (query: string) => void;
    clearSearch: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [query, setQueryState] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const setQuery = useCallback((text: string) => {
        setQueryState(text);
        if (text.trim().length > 1) {
            const hits = searchService.search(text);
            setResults(hits);
            setIsOpen(true);
        } else {
            setResults([]);
            // Don't close immediately if user just clears text, keeps UI stable
        }
    }, []);

    const clearSearch = useCallback(() => {
        setQueryState('');
        setResults([]);
        setIsOpen(false);
    }, []);

    return (
        <SearchContext.Provider value={{
            query,
            results,
            isSearching: query.length > 0,
            setQuery,
            clearSearch,
            isOpen,
            setIsOpen
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
