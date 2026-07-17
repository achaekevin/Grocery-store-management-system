export type SearchEntityType = 
  | 'products' 
  | 'customers' 
  | 'suppliers' 
  | 'users' 
  | 'orders' 
  | 'branches' 
  | 'categories' 
  | 'transactions';

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string;
  description?: string;
  metadata?: Record<string, any>;
  url?: string;
  icon?: string;
  image?: string;
}

export interface SearchFilters {
  types?: SearchEntityType[];
  dateFrom?: Date;
  dateTo?: Date;
  branchId?: string;
  status?: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  suggestions?: string[];
}
