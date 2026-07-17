import apiService from './api';
import { SearchResponse, SearchFilters, SearchHistory } from '@/types/search.types';

class SearchService {
  private readonly baseUrl = '/search';
  private readonly historyKey = 'search_history';
  private readonly maxHistoryItems = 20;

  async globalSearch(query: string, filters?: SearchFilters): Promise<SearchResponse> {
    return apiService.post<SearchResponse>(`${this.baseUrl}/global`, {
      query,
      filters,
    });
  }

  async getSuggestions(query: string): Promise<string[]> {
    const response = await apiService.get<{ suggestions: string[] }>(
      `${this.baseUrl}/suggestions`,
      { params: { q: query } }
    );
    return response.suggestions;
  }

  getSearchHistory(): SearchHistory[] {
    try {
      const history = localStorage.getItem(this.historyKey);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  addToHistory(query: string, resultsCount: number): void {
    const history = this.getSearchHistory();
    const newEntry: SearchHistory = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      resultsCount,
    };

    const filtered = history.filter(
      (item) => item.query.toLowerCase() !== query.toLowerCase()
    );

    const updated = [newEntry, ...filtered].slice(0, this.maxHistoryItems);
    localStorage.setItem(this.historyKey, JSON.stringify(updated));
  }

  clearHistory(): void {
    localStorage.removeItem(this.historyKey);
  }

  removeFromHistory(id: string): void {
    const history = this.getSearchHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(this.historyKey, JSON.stringify(updated));
  }
}

export const searchService = new SearchService();
export default searchService;
