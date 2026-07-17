import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/services/search.service';
import { SearchFilters, SearchHistory } from '@/types/search.types';

export const useGlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);

  useEffect(() => {
    setHistory(searchService.getSearchHistory());
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['globalSearch', query, filters],
    queryFn: () => searchService.globalSearch(query, filters),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  const { data: suggestions } = useQuery({
    queryKey: ['searchSuggestions', query],
    queryFn: () => searchService.getSuggestions(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 10,
  });

  const search = useCallback((searchQuery: string, searchFilters?: SearchFilters) => {
    setQuery(searchQuery);
    if (searchFilters) {
      setFilters(searchFilters);
    }
    
    if (searchQuery.length >= 2) {
      searchService.addToHistory(searchQuery, data?.total || 0);
      setHistory(searchService.getSearchHistory());
    }
  }, [data?.total]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
  }, []);

  const clearHistory = useCallback(() => {
    searchService.clearHistory();
    setHistory([]);
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    searchService.removeFromHistory(id);
    setHistory(searchService.getSearchHistory());
  }, []);

  const startVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsVoiceSearchActive(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      search(transcript, filters);
    };
    recognition.onerror = () => setIsVoiceSearchActive(false);
    recognition.onend = () => setIsVoiceSearchActive(false);

    recognition.start();
  }, [filters, search]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results: data?.results || [],
    total: data?.total || 0,
    suggestions: suggestions || [],
    isLoading,
    error,
    search,
    clearSearch,
    history,
    clearHistory,
    removeHistoryItem,
    isVoiceSearchActive,
    startVoiceSearch,
  };
};
