import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Camera,
  X,
  Check,
  AlertCircle,
  History,
  Package,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface ScannedItem {
  id: string;
  barcode: string;
  name: string;
  price: number;
  timestamp: Date;
  image?: string;
}

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose?: () => void;
  showHistory?: boolean;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onClose,
  showHistory = true,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [scanHistory, setScanHistory] = useState<ScannedItem[]>([]);
  const [lastScanned, setLastScanned] = useState<ScannedItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Load scan history from localStorage
    const history = localStorage.getItem('scan_history');
    if (history) {
      setScanHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    if (isScanning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isScanning]);

  const startScanning = async () => {
    setIsScanning(true);
    setError(null);

    // Try to access camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Camera access denied. Please use manual entry.');
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleScan = (barcode: string) => {
    if (!barcode) return;

    // Mock product lookup
    const mockProduct: ScannedItem = {
      id: Date.now().toString(),
      barcode,
      name: `Product ${barcode}`,
      price: Math.random() * 50 + 5,
      timestamp: new Date(),
    };

    setLastScanned(mockProduct);
    setScannedCode('');
    
    // Add to history
    const newHistory = [mockProduct, ...scanHistory].slice(0, 20);
    setScanHistory(newHistory);
    localStorage.setItem('scan_history', JSON.stringify(newHistory));

    // Callback
    onScan(barcode);

    // Auto-clear after 2 seconds
    setTimeout(() => {
      setLastScanned(null);
    }, 2000);
  };

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(scannedCode);
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('scan_history');
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Scan className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Barcode Scanner
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scanner Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Camera View */}
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-4 border-green-500 rounded-lg"></div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                    Position barcode within the frame
                  </p>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <Camera className="w-16 h-16 mb-4" />
                <p className="text-sm">Camera inactive</p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Last Scanned */}
          <AnimatePresence>
            {lastScanned && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {lastScanned.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {lastScanned.barcode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${lastScanned.price.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scanner Controls */}
          <div className="flex items-center gap-3">
            {!isScanning ? (
              <button
                onClick={startScanning}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                <Camera className="w-5 h-5" />
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                <X className="w-5 h-5" />
                Stop Camera
              </button>
            )}
          </div>

          {/* Manual Entry */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Manual Entry
            </h3>
            <form onSubmit={handleManualEntry} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                placeholder="Enter barcode manually..."
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Scan
              </button>
            </form>
          </div>

          {/* Scan History */}
          {showHistory && scanHistory.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recently Scanned
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2">
                {scanHistory.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleScan(item.barcode)}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">{item.barcode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
