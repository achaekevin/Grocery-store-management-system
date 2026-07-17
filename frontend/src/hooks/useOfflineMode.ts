import { useState, useEffect, useCallback } from 'react';

interface QueuedOperation {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  retries: number;
}

export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState<QueuedOperation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Load queued operations from localStorage
    const savedQueue = localStorage.getItem('offline_queue');
    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }

    const handleOnline = () => {
      console.log('Connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('Connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync when connection is restored
  useEffect(() => {
    if (isOnline && queue.length > 0 && !isSyncing) {
      syncQueue();
    }
  }, [isOnline, queue.length]);

  const queueOperation = useCallback((type: string, data: any) => {
    const operation: QueuedOperation = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date(),
      retries: 0,
    };

    const newQueue = [...queue, operation];
    setQueue(newQueue);
    localStorage.setItem('offline_queue', JSON.stringify(newQueue));

    console.log('Operation queued:', operation);
  }, [queue]);

  const syncQueue = async () => {
    if (isSyncing || queue.length === 0) return;

    setIsSyncing(true);
    console.log('Syncing queued operations...');

    const results = await Promise.allSettled(
      queue.map(async (operation) => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // In real implementation, make actual API calls based on operation type
          console.log('Synced:', operation);
          
          return operation.id;
        } catch (error) {
          console.error('Failed to sync operation:', operation.id, error);
          throw error;
        }
      })
    );

    // Remove successful operations from queue
    const successfulIds = results
      .filter((result) => result.status === 'fulfilled')
      .map((result: any) => result.value);

    const newQueue = queue.filter((op) => !successfulIds.includes(op.id));
    
    setQueue(newQueue);
    localStorage.setItem('offline_queue', JSON.stringify(newQueue));
    setIsSyncing(false);

    console.log(`Sync complete: ${successfulIds.length} operations synced, ${newQueue.length} remaining`);
  };

  const clearQueue = useCallback(() => {
    setQueue([]);
    localStorage.removeItem('offline_queue');
  }, []);

  const getQueueSize = useCallback(() => queue.length, [queue]);

  return {
    isOnline,
    queue,
    isSyncing,
    queueOperation,
    syncQueue,
    clearQueue,
    getQueueSize,
  };
};
