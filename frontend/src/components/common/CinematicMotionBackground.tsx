import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, ShoppingBag, Warehouse, Sparkles, BarChart2, Activity } from 'lucide-react';

import supermarketImg from '@assets/images/supermarket_aisle.jpg';
import checkoutImg from '@assets/images/warehouse_fulfillment.jpg';
import inventoryImg from '@assets/images/gourmet_bakery.jpg';

interface Scene {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  icon: React.ElementType;
  telemetry: {
    label: string;
    value: string;
    status: string;
  }[];
}

const scenes: Scene[] = [
  {
    id: 'produce',
    title: 'Kenyan Fresh Produce Aisle',
    subtitle: 'Local Organic Farms & Smart Digital Price Tags',
    image: supermarketImg,
    badge: 'NAIROBI FRESH MARKET',
    icon: Store,
    telemetry: [
      { label: 'Fresh Produce', value: 'Avocados & Mangoes', status: 'In Stock' },
      { label: 'Digital Tags', value: 'Synced Live (KES)', status: 'Optimal' },
      { label: 'Local Sourcing', value: 'Kenyan Farms', status: 'Direct' },
    ],
  },
  {
    id: 'checkout',
    title: 'Modern POS & Checkout',
    subtitle: 'Integrated M-PESA & Fast Barcode Scanning',
    image: checkoutImg,
    badge: 'SMART CHECKOUT COUNTER',
    icon: ShoppingBag,
    telemetry: [
      { label: 'Payments', value: 'M-PESA & Card', status: 'Ready' },
      { label: 'POS Speed', value: '2.8s / Customer', status: 'Fast' },
      { label: 'Till Balance', value: 'Auto-Reconciled', status: 'Active' },
    ],
  },
  {
    id: 'inventory',
    title: 'Store Stockroom & Warehouse',
    subtitle: 'Real-Time Inventory Audits & Barcode Tracking',
    image: inventoryImg,
    badge: 'REAL-TIME INVENTORY AUDIT',
    icon: Warehouse,
    telemetry: [
      { label: 'Scanner Sync', value: 'Handheld Active', status: 'Connected' },
      { label: 'Stock Accuracy', value: '99.8% Verified', status: 'Passed' },
      { label: 'Reorder System', value: 'Auto Trigger', status: 'Enabled' },
    ],
  },
];

export const CinematicMotionBackground: React.FC = () => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Continuous loop every 6.5 seconds with camera glide & motion blur
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 800);
      setActiveSceneIndex((prev) => (prev + 1) % scenes.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handleSelectScene = (index: number) => {
    if (index === activeSceneIndex) return;
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 800);
    setActiveSceneIndex(index);
  };

  const currentScene = scenes[activeSceneIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-black min-h-[580px] lg:min-h-[660px] flex items-center justify-center">
      {/* Background Image Carousel with Ken Burns Camera Glide & Motion Blur */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
          animate={{
            opacity: 1,
            scale: [1.05, 1.15],
            filter: isTransitioning ? 'blur(8px)' : 'blur(0px)',
          }}
          exit={{ opacity: 0, scale: 1.18, filter: 'blur(14px)' }}
          transition={{
            opacity: { duration: 1.2, ease: 'easeInOut' },
            scale: { duration: 7, ease: 'linear', repeat: Infinity, repeatType: 'reverse' },
            filter: { duration: 0.6 },
          }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentScene.image})` }}
        />
      </AnimatePresence>

      {/* Motion Blur Overlay during interchange transitions */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 backdrop-blur-md bg-black/35 transition-all duration-500"
        />
      )}

      {/* Semi-transparent dark overlay & center negative space vignette */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-950/60 via-slate-950/90 to-slate-950" />

      {/* Dynamic Animated Particles & Scanning Beam Line */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-25">
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        <motion.div
          animate={{ y: ['0%', '100%', '0%'] }}
          transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
          className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent blur-sm"
        />
      </div>

      {/* Floating Smart HUD Telemetry Overlay - Top Left with Levitating Animation */}
      <motion.div
        key={`hud-top-${currentScene.id}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
        transition={{ 
          opacity: { duration: 0.6 },
          y: { duration: 4, ease: 'easeInOut', repeat: Infinity }
        }}
        className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-3 rounded-full border border-emerald-500/30 bg-slate-900/70 backdrop-blur-xl px-4 py-2 shadow-2xl"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <currentScene.icon className="h-4 w-4 animate-pulse" />
        </div>
        <div className="text-xs">
          <span className="font-semibold text-white">{currentScene.badge}</span>
          <span className="mx-2 text-emerald-500/50">•</span>
          <span className="text-emerald-300 font-mono">KENYA STORE OPS</span>
        </div>
      </motion.div>

      {/* Floating Smart HUD Telemetry Overlay - Top Right with Pulse Animation */}
      <motion.div
        key={`hud-top-right-${currentScene.id}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
        transition={{ 
          opacity: { duration: 0.6 },
          y: { duration: 5, ease: 'easeInOut', repeat: Infinity, delay: 0.5 }
        }}
        className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-slate-900/75 backdrop-blur-xl px-4 py-2.5 shadow-2xl text-xs text-white/90"
      >
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-mono text-emerald-400 font-semibold">LIVE RECONCILIATION</span>
        <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse ml-1" />
      </motion.div>

      {/* Floating Telemetry Stats Bar - Bottom Edges */}
      <div className="absolute bottom-16 left-6 right-6 z-20 hidden lg:flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          {currentScene.telemetry.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: [0, -4, 0] }}
              transition={{ 
                opacity: { duration: 0.4, delay: i * 0.1 },
                y: { duration: 3.5, ease: 'easeInOut', repeat: Infinity, delay: i * 0.3 }
              }}
              className="rounded-lg border border-emerald-500/20 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 shadow-lg text-left"
            >
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{item.label}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-white font-mono">{item.value}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-semibold border border-emerald-500/40">
                  {item.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scene Switcher Control Pills at Bottom Center */}
      <div className="absolute bottom-5 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/85 backdrop-blur-xl px-3 py-1.5 shadow-2xl">
        {scenes.map((scene, index) => {
          const isActive = index === activeSceneIndex;
          const Icon = scene.icon;
          return (
            <motion.button
              key={scene.id}
              onClick={() => handleSelectScene(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{scene.title.split(' ')[0]}</span>
              {isActive && (
                <motion.div
                  layoutId="activeSceneIndicator"
                  className="h-1.5 w-1.5 rounded-full bg-slate-950 animate-ping"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
