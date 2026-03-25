import { useState, useMemo, useDeferredValue } from 'react';

export interface SearchableItem {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
}

export const useSearch = <T extends SearchableItem>(items: T[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);

  const filteredItems = useMemo(() => {
    const query = deferredQuery.toLowerCase().trim();
    if (!query) return items;

    return items.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const descMatch = item.description?.toLowerCase().includes(query);
      const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(query));
      
      return nameMatch || descMatch || tagsMatch;
    });
  }, [items, deferredQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    isStale: searchQuery !== deferredQuery
  };
};
