import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Languages,
  LogIn,
  Moon,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Sun,
  UserPlus,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@components/ui/Button';
import { CinematicMotionBackground } from '@components/common/CinematicMotionBackground';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { toggleTheme } from '@store/slices/themeSlice';

import kenyaHeroImg from '@assets/images/kenya_hero.jpg';
import kenyaCheckoutImg from '@assets/images/kenya_checkout.jpg';
import kenyaInventoryImg from '@assets/images/kenya_inventory.jpg';

type Language = 'en' | 'sw';

interface CopyContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  signIn: string;
  signUp: string;
  featuresTitle: string;
  featuresSubtitle: string;
  galleryTitle: string;
  gallerySubtitle: string;
  aboutTitle: string;
  aboutSubtitle: string;
  footer: string;
}

const copy: Record<Language, CopyContent> = {
  en: {
    eyebrow: 'Modern Grocery Store Management System in Kenya',
    title: 'Manage your grocery store with confidence & ease',
    subtitle:
      'A complete, modern grocery store management system for inventory control, sales tracking, customer loyalty, M-PESA POS integration, and multi-branch analytics built for Kenyan retail.',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    featuresTitle: 'Everything you need to run your grocery store',
    featuresSubtitle: 'Powerful features designed to streamline daily store operations and maximize profitability',
    galleryTitle: 'Built for Modern Kenyan Grocery Stores',
    gallerySubtitle: 'Real-time grocery store management system tailored for fresh produce, POS checkout counters, and inventory stockrooms',
    aboutTitle: 'Why choose GroceryOS?',
    aboutSubtitle: 'Designed specifically for grocery stores and retail operations with features that matter most',
    footer: '© 2026 GroceryOS. Modern Grocery Store Management System.',
  },
  sw: {
    eyebrow: 'Usimamizi wa Kisasa wa Duka la Mboga nchini Kenya',
    title: 'Simamia duka lako la mboga kwa ujasiri na urahisi',
    subtitle:
      'Mfumo kamili wa usimamizi wa duka la mboga kwa ufuatiliaji wa hesabu, mauzo, uaminifu wa wateja, utengamano wa M-PESA POS, na uchambuzi wa biashara.',
    signIn: 'Ingia',
    signUp: 'Jisajili',
    featuresTitle: 'Kila kitu unachohitaji kuendesha duka lako la mboga',
    featuresSubtitle: 'Vipengele vyenye nguvu vilivyoundwa kurahisisha shughuli za kila siku za duka lako',
    galleryTitle: 'Imejengwa kwa Ajili ya Maduka ya Mboga ya Kisasa nchini Kenya',
    gallerySubtitle: 'Mfumo wa kusimamia duka la mboga kwa wakati halisi kwa bidhaa mpya, malipo, na maghala',
    aboutTitle: 'Kwa nini uchague GroceryOS?',
    aboutSubtitle: 'Imejengwa kwa ajili ya biashara za maduka ya mboga na rejareja na vipengele vinavyohitajika zaidi',
    footer: '© 2026 GroceryOS. Mfumo wa Usimamizi wa Duka la Mboga.',
  },
};

const features: Array<{ title: string; description: string; icon: LucideIcon }> = [
  { 
    title: 'Inventory Management', 
    description: 'Track stock levels, receive low-stock alerts, and manage product catalogs with instant barcode scanning.', 
    icon: Package 
  },
  { 
    title: 'Sales & M-PESA POS', 
    description: 'Fast checkout process with integrated M-PESA payment reconciliation and cash till management.', 
    icon: ShoppingCart 
  },
  { 
    title: 'Customer Loyalty', 
    description: 'Build customer relationships with loyalty points, phone lookup, and personalized rewards.', 
    icon: BadgeCheck 
  },
  { 
    title: 'Analytics & Reports', 
    description: 'Make data-driven decisions with real-time profit tracking and customizable daily reports.', 
    icon: BarChart3 
  },
  { 
    title: 'Multi-User Access', 
    description: 'Role-based permissions for cashiers, store managers, and admins with detailed audit logs.', 
    icon: Users 
  },
  { 
    title: 'Multi-Branch Support', 
    description: 'Manage multiple grocery store locations from a single unified dashboard with central stock control.', 
    icon: Store 
  },
];

const galleryItems = [
  {
    title: 'Fresh Produce & Local Farm Displays',
    subtitle: 'Grocery Fresh Farm Produce',
    description: 'Manage fresh inventory, weight-based pricing, and digital price tag synchronization for fresh fruits and vegetables.',
    image: kenyaHeroImg,
    badge: 'FRESH DEPARTMENT',
    tag: 'Live Weight & KES Pricing',
  },
  {
    title: 'Smart Grocery Checkout & M-PESA POS',
    subtitle: 'Instant Cashier Reconciliations',
    description: 'Seamless POS till processing with direct M-PESA STK push, card payments, and receipt printing.',
    image: kenyaCheckoutImg,
    badge: 'POS CHECKOUT COUNTERS',
    tag: 'M-PESA & Card Till Sync',
  },
  {
    title: 'Stockroom & Grocery Inventory Audits',
    subtitle: 'Handheld Barcode Scanning',
    description: 'Empower store staff with barcode scanners for fast stock intakes, transfers, and real-time audit logs.',
    image: kenyaInventoryImg,
    badge: 'STOCKROOM & AUDITS',
    tag: 'Real-time Stock Control',
  },
];

const benefits: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: 'Easy to Use',
    description: 'Intuitive interface designed for quick learning and efficient daily operations for cashiers and store managers.',
    icon: Zap,
  },
  {
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with role-based access control and comprehensive audit trails.',
    icon: ShieldCheck,
  },
  {
    title: 'Scalable Solution',
    description: 'Grows with your business from a single grocery store to multiple branch locations seamlessly.',
    icon: Store,
  },
];

export const LandingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const [language, setLanguage] = useState<Language>('en');
  const content = useMemo(() => copy[language], [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-lg">
              G
            </div>
            <div>
              <p className="text-base font-bold">GroceryOS</p>
              <p className="text-xs text-muted-foreground">Grocery Store Management</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features" className="transition hover:text-primary">Features</a>
            <a href="#showcase" className="transition hover:text-primary">Store Gallery</a>
            <a href="#about" className="transition hover:text-primary">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="outline" className="rounded-lg gap-2 font-medium">
                <LogIn className="h-4 w-4" />
                {content.signIn}
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button className="rounded-lg gap-2 font-semibold shadow-md hover:shadow-primary/25">
                <UserPlus className="h-4 w-4" />
                {content.signUp}
              </Button>
            </Link>

            <div className="h-6 w-px bg-border mx-1" />

            <button
              type="button"
              onClick={() => setLanguage((prev) => (prev === 'en' ? 'sw' : 'en'))}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-accent"
            >
              <Languages className="h-4 w-4" />
              {language === 'en' ? 'EN' : 'SW'}
            </button>
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="rounded-lg border border-border bg-background p-2 shadow-sm transition hover:bg-accent"
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        {/* Hero Section with Animated Glassmorphic Overlay & Cinematic Background */}
        <section className="py-8 lg:py-12">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
            {/* Cinematic Motion Background featuring natural Kenyan store visuals */}
            <CinematicMotionBackground />

            {/* Floating Glass Hero Card with Shimmer & Entrance Animations */}
            <div className="absolute inset-0 z-20 flex items-center justify-center p-6 md:p-12">
              <motion.div 
                initial={{ opacity: 0, y: 35, scale: 0.97 }} 
                animate={{ 
                  opacity: 1, 
                  y: [0, -6, 0],
                  scale: 1 
                }} 
                transition={{ 
                  opacity: { duration: 0.7 },
                  scale: { duration: 0.7 },
                  y: { duration: 6, ease: 'easeInOut', repeat: Infinity }
                }} 
                className="relative max-w-3xl text-center rounded-3xl border border-white/20 bg-slate-950/85 backdrop-blur-2xl p-8 md:p-12 shadow-2xl shadow-emerald-950/60 overflow-hidden"
              >
                {/* Glowing Light Beam Ring Effect */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

                {/* Animated Eyebrow Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-300 backdrop-blur-md shadow-inner"
                >
                  <Sparkles className="h-4 w-4 text-emerald-400 animate-spin-slow" />
                  {content.eyebrow}
                </motion.div>
                
                {/* Shimmer Gradient Animated Title - Grocery Store Management System */}
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white drop-shadow-md"
                >
                  <span className="bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                    {content.title}
                  </span>
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300 font-normal"
                >
                  {content.subtitle}
                </motion.p>

                {/* Animated Sign In and Sign Up Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-8 flex flex-wrap items-center justify-center gap-4"
                >
                  <Link to="/auth/login">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                      <Button variant="outline" size="lg" className="rounded-2xl px-7 py-3 text-base font-bold border-emerald-500/50 bg-slate-900/90 text-white hover:bg-slate-800 hover:border-emerald-400 hover:text-emerald-300 shadow-lg hover:shadow-emerald-500/20 backdrop-blur-md gap-2 transition-all">
                        <LogIn className="h-5 w-5 text-emerald-400 animate-pulse" />
                        {content.signIn}
                      </Button>
                    </motion.div>
                  </Link>

                  <Link to="/auth/register">
                    <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
                      <Button size="lg" className="rounded-2xl px-8 py-3 text-base font-bold bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-400/50 transition-all gap-2 border border-emerald-300/40">
                        <UserPlus className="h-5 w-5 text-slate-950" />
                        {content.signUp}
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Modern Kenyan Grocery Store Gallery & Animations Showcase */}
        <section id="showcase" className="py-20">
          <div className="text-center">
            <h2 className="text-base font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
              {content.galleryTitle}
            </h2>
            <p className="mt-2 text-3xl font-bold sm:text-4xl">
              {content.gallerySubtitle}
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-lg hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col"
              >
                {/* Image Container with Zoom Animation */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Badge Chips */}
                  <div className="absolute top-4 left-4 rounded-full border border-white/20 bg-slate-950/70 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
                    {item.badge}
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-lg bg-emerald-500/90 text-slate-950 px-2.5 py-1 text-[11px] font-bold shadow-md">
                    {item.tag}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                      {item.subtitle}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Active System Feature</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="text-center">
            <h2 className="text-base font-semibold uppercase tracking-wider text-primary">
              {content.featuresTitle}
            </h2>
            <p className="mt-2 text-3xl font-bold sm:text-4xl">
              {content.featuresSubtitle}
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-xl border border-border bg-card p-8 shadow-sm transition hover:shadow-lg hover:border-primary/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="rounded-2xl border border-border bg-card p-8 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold uppercase tracking-wider text-primary">
                {content.aboutTitle}
              </h2>
              <p className="mt-2 text-3xl font-bold sm:text-4xl">
                {content.aboutSubtitle}
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-xl border border-border bg-background p-6 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                G
              </div>
              <span className="font-semibold">GroceryOS</span>
            </div>
            <p className="text-sm text-muted-foreground">{content.footer}</p>
            <div className="flex gap-6">
              <a href="#features" className="text-sm text-muted-foreground transition hover:text-primary">
                Features
              </a>
              <a href="#showcase" className="text-sm text-muted-foreground transition hover:text-primary">
                Store Gallery
              </a>
              <a href="#about" className="text-sm text-muted-foreground transition hover:text-primary">
                About
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
