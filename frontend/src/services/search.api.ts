import apiService from './api';

export interface SearchResult {
  products?: any[];
  customers?: any[];
  suppliers?: any[];
  users?: any[];
  orders?: any[];
  branches?: any[];
  categories?: any[];
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  searchType: string;
  resultCount: number;
  createdAt: string;
}

export interface GlobalSearchResponse {
  success: boolean;
  data: {
    query: string;
    type: string;
    results: SearchResult;
    totalCount: number;
  };
}

export interface SearchHistoryResponse {
  success: boolean;
  data: SearchHistoryItem[];
}

export interface PopularSearchResponse {
  success: boolean;
  data: { query: string; count: number }[];
}

export const searchApi = {
  // Global search
  globalSearch: (query: string, type: string = 'all', limit: number = 10) => {
    return apiService.get<GlobalSearchResponse>(
      `/v1/search?query=${encodeURIComponent(query)}&type=${type}&limit=${limit}`
    );
  },

  // Get search history
  getSearchHistory: (limit: number = 10) => {
    return apiService.get<SearchHistoryResponse>(`/v1/search/history?limit=${limit}`);
  },

  // Get popular searches
  getPopularSearches: (limit: number = 10) => {
    return apiService.get<PopularSearchResponse>(`/v1/search/popular?limit=${limit}`);
  },

  // Record clicked result
  recordClickedResult: (data: {
    searchId: string;
    resultId: string;
    resultType: string;
  }) => {
    return apiService.post('/v1/search/click', data);
  },

  // Clear search history
  clearSearchHistory: () => {
    return apiService.delete('/v1/search/history');
  },
};

export default searchApi;
