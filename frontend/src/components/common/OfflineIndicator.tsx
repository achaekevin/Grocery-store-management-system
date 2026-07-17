import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw, AlertCircle } from 'lucide-react';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { cn } from '@/utils/cn';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, queue, isSyncing, syncQueue, getQueueSize } = useOfflineMode();

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 shadow-lg"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WifiOff className="w-5 h-5 animate-pulse" />
                <div>
                  <p className="font-semibold">You're offline</p>
                  <p className="text-sm opacity-90">
                    {getQueueSize() > 0
                      ? `${getQueueSize()} operations will sync when connection is restored`
                      : 'Changes will be saved locally'}
                  </p>
                </div>
              </div>
              {getQueueSize() > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{getQueueSize()} pending</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Syncing Indicator */}
      <AnimatePresence>
        {isOnline && isSyncing && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 shadow-lg"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <p className="font-semibold">Syncing data...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Restored Notification */}
      <AnimatePresence>
        {isOnline && !isSyncing && queue.length === 0 && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-xl"
          >
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5" />
              <p className="font-semibold">Connection restored</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicator in Corner */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => !isOnline && syncQueue()}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-colors',
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-orange-500 text-white cursor-pointer hover:bg-orange-600'
          )}
          title={isOnline ? 'Online' : 'Offline - Click to retry sync'}
        >
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">Offline</span>
              {getQueueSize() > 0 && (
                <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs">
                  {getQueueSize()}
                </span>
              )}
            </>
          )}
        </motion.button>
      </div>
    </>
  );
};
