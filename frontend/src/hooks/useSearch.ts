import { useState, useMemo, useDeferredValue, useEffect, useCallback } from 'react';

export interface SearchableItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  tags?: string[];
}

/**
 * Custom hook for performing client-side searching and filtering of items.
 * Supports URL synchronization, deferred updates for performance, and category filtering.
 * 
 * @template T - The type of items to search, must extend SearchableItem.
 * @param {T[]} items - The initial list of items to filter.
 * @returns {Object} Search state and utility functions.
 */
export const useSearch = <T extends SearchableItem>(items: T[]) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('q') || '';
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    return new URLSearchParams(window.location.search)
      .get('c')
      ?.split(',')
      .map((category) => category.trim())
      .filter(Boolean) || [];
  });
  const deferredQuery = useDeferredValue(searchQuery);

  // Sync state to URL with debounce
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategories.length > 0) params.set('c', selectedCategories.join(','));
      
      const newSearch = params.toString();
      const currentSearch = window.location.search.replace('?', '');
      
      if (newSearch !== currentSearch) {
        const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
        window.history.replaceState({}, '', newUrl);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategories]);

  const filteredItems = useMemo(() => {
    let result = items;

    // Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter(item => selectedCategories.includes(item.category));
    }

    // Search Query Filter
    const query = deferredQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(query));
        return nameMatch || descMatch || tagsMatch;
      });
    }

    return result;
  }, [items, deferredQuery, selectedCategories]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    toggleCategory,
    filteredItems,
    isStale: searchQuery !== deferredQuery
  };
};
