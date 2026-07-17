import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command as CommandIcon, X, ArrowRight } from 'lucide-react';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { Command } from '@/types/command.types';
import { cn } from '@/utils/cn';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  navigation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  actions: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  search: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  create: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  settings: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  reports: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  branch: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const { query, setQuery, groupedCommands, filteredCommands, executeCommand } = useCommandPalette();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleCommandClick = (command: Command) => {
    executeCommand(command);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <CommandIcon className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Commands List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <CommandIcon className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">No commands found</p>
                  {query && (
                    <p className="text-xs mt-1">Try a different search term</p>
                  )}
                </div>
              ) : (
                <div className="py-2">
                  {groupedCommands.map((group, groupIndex) => (
                    <div key={group.title} className={groupIndex > 0 ? 'mt-4' : ''}>
                      <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {group.title}
                        </h3>
                      </div>
                      <div className="px-2">
                        {group.commands.map((command, cmdIndex) => {
                          const globalIndex = filteredCommands.findIndex(c => c.id === command.id);
                          const isSelected = globalIndex === selectedIndex;
                          
                          return (
                            <button
                              key={command.id}
                              onClick={() => handleCommandClick(command)}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all',
                                isSelected
                                  ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-inset'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                              )}
                            >
                              {/* Icon */}
                              <div className={cn(
                                'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                                categoryColors[command.category] || 'bg-gray-100 text-gray-600'
                              )}>
                                {command.icon}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {command.label}
                                  </span>
                                </div>
                                {command.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {command.description}
                                  </p>
                                )}
                              </div>

                              {/* Shortcut or Arrow */}
                              {command.shortcut ? (
                                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600">
                                  {command.shortcut}
                                </kbd>
                              ) : isSelected ? (
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↓</kbd>
                    <span className="ml-1">Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↵</kbd>
                    <span className="ml-1">Select</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Esc</kbd>
                    <span className="ml-1">Close</span>
                  </div>
                </div>
                {filteredCommands.length > 0 && (
                  <span className="hidden sm:inline">{filteredCommands.length} commands</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
