import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mic, Clock, Filter, Loader2, Package, Users, ShoppingCart, Building2, Grid3x3, Receipt, User } from 'lucide-react';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { SearchResult, SearchEntityType } from '@/types/search.types';
import { cn } from '@/utils/cn';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const entityIcons: Record<SearchEntityType, React.ReactNode> = {
  products: <Package className="w-4 h-4" />,
  customers: <Users className="w-4 h-4" />,
  suppliers: <Building2 className="w-4 h-4" />,
  users: <User className="w-4 h-4" />,
  orders: <ShoppingCart className="w-4 h-4" />,
  branches: <Building2 className="w-4 h-4" />,
  categories: <Grid3x3 className="w-4 h-4" />,
  transactions: <Receipt className="w-4 h-4" />,
};

const entityColors: Record<SearchEntityType, string> = {
  products: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  customers: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  suppliers: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  users: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  orders: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  branches: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  categories: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  transactions: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const {
    query,
    setQuery,
    results,
    isLoading,
    suggestions,
    history,
    clearHistory,
    removeHistoryItem,
    isVoiceSearchActive,
    startVoiceSearch,
  } = useGlobalSearch();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const urls: Record<SearchEntityType, string> = {
      products: `/products/${result.id}`,
      customers: `/customers/${result.id}`,
      suppliers: `/suppliers/${result.id}`,
      users: `/users/${result.id}`,
      orders: `/orders/${result.id}`,
      branches: `/branches/${result.id}`,
      categories: `/categories/${result.id}`,
      transactions: `/transactions/${result.id}`,
    };
    navigate(result.url || urls[result.type]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-3xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, customers, suppliers, orders..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
              
              <button
                onClick={startVoiceSearch}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isVoiceSearchActive 
                    ? "bg-red-100 text-red-600 animate-pulse" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                )}
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showFilters 
                    ? "bg-blue-100 text-blue-600" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                )}
              >
                <Filter className="w-5 h-5" />
              </button>

              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              )}

              {!isLoading && !query && history.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </h3>
                    <button onClick={clearHistory} className="text-xs text-blue-600 hover:text-blue-700">
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {history.slice(0, 5).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setQuery(item.query)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.query}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHistoryItem(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Search className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="p-2">
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelectResult(result)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                        index === selectedIndex
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      )}
                    >
                      <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg shrink-0", entityColors[result.type])}>
                        {entityIcons[result.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{result.title}</h4>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {result.type}
                          </span>
                        </div>
                        {result.subtitle && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.subtitle}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>ESC Close</span>
                </div>
                {results.length > 0 && <span>{results.length} results</span>}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
