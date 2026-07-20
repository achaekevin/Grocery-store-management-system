import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Languages,
  Moon,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Sun,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@components/ui/Button';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { toggleTheme } from '@store/slices/themeSlice';

type Language = 'en' | 'sw';

interface CopyContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  featuresTitle: string;
  featuresSubtitle: string;
  aboutTitle: string;
  aboutSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
  footer: string;
}

const copy: Record<Language, CopyContent> = {
  en: {
    eyebrow: 'Modern Grocery Store Management',
    title: 'Manage your grocery store with confidence',
    subtitle:
      'A complete solution for inventory management, sales tracking, customer loyalty, and business analytics. Built for modern retail operations.',
    primaryCta: 'Get Started',
    featuresTitle: 'Everything you need to run your store',
    featuresSubtitle: 'Powerful features designed to streamline your daily operations and grow your business',
    aboutTitle: 'Why choose GroceryOS?',
    aboutSubtitle: 'Built specifically for grocery and retail businesses with the features that matter most',
    contactTitle: 'Ready to get started?',
    contactSubtitle: 'Sign in to access your dashboard and start managing your store efficiently',
    footer: '© 2026 GroceryOS. Built for modern retail teams.',
  },
  sw: {
    eyebrow: 'Usimamizi wa Kisasa wa Duka la Mboga',
    title: 'Simamia duka lako la mboga kwa ujasiri',
    subtitle:
      'Suluhisho kamili la usimamizi wa hesabu, ufuatiliaji wa mauzo, uaminifu wa wateja, na uchambuzi wa biashara. Imejengwa kwa ajili ya shughuli za rejareja za kisasa.',
    primaryCta: 'Anza',
    featuresTitle: 'Kila kitu unachohitaji kuendesha duka lako',
    featuresSubtitle: 'Vipengele vyenye nguvu vilivyoundwa kurahisisha shughuli zako za kila siku na kukuza biashara yako',
    aboutTitle: 'Kwa nini uchague GroceryOS?',
    aboutSubtitle: 'Imejengwa hasa kwa ajili ya biashara za mboga na rejareja na vipengele vinavyohitajika zaidi',
    contactTitle: 'Uko tayari kuanza?',
    contactSubtitle: 'Ingia ili kufikia dashibodi yako na kuanza kusimamia duka lako kwa ufanisi',
    footer: '© 2026 GroceryOS. Imejengwa kwa timu za rejareja za kisasa.',
  },
};

const features: Array<{ title: string; description: string; icon: LucideIcon }> = [
  { 
    title: 'Inventory Management', 
    description: 'Track stock levels, receive low-stock alerts, and manage product catalog efficiently.', 
    icon: Package 
  },
  { 
    title: 'Sales & POS', 
    description: 'Fast checkout process with flexible payment options and comprehensive sales tracking.', 
    icon: ShoppingCart 
  },
  { 
    title: 'Customer Loyalty', 
    description: 'Build customer relationships with loyalty programs and personalized rewards.', 
    icon: BadgeCheck 
  },
  { 
    title: 'Analytics & Reports', 
    description: 'Make data-driven decisions with detailed insights and customizable reports.', 
    icon: BarChart3 
  },
  { 
    title: 'Multi-User Access', 
    description: 'Role-based permissions for your team with secure access control and audit logs.', 
    icon: Users 
  },
  { 
    title: 'Multi-Branch Support', 
    description: 'Manage multiple store locations from a single platform with centralized control.', 
    icon: Store 
  },
];

const benefits: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: 'Easy to Use',
    description: 'Intuitive interface designed for quick learning and efficient daily operations.',
    icon: Zap,
  },
  {
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with role-based access and comprehensive audit trails.',
    icon: ShieldCheck,
  },
  {
    title: 'Scalable Solution',
    description: 'Grows with your business from single store to multiple branches seamlessly.',
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
              <p className="text-xs text-muted-foreground">Store Management</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features" className="transition hover:text-primary">Features</a>
            <a href="#about" className="transition hover:text-primary">About</a>
            <a href="#contact" className="transition hover:text-primary">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button className="rounded-lg">
                {content.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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
        {/* Hero Section */}
        <section className="py-20 lg:py-28">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              {content.eyebrow}
            </div>
            
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              {content.title}
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {content.subtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/auth/login">
                <Button size="lg" className="rounded-lg px-8 text-base">
                  {content.primaryCta}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            className="mt-16"
          >
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-background p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Products</p>
                        <p className="mt-2 text-3xl font-bold">Track</p>
                      </div>
                      <Package className="h-10 w-10 text-primary opacity-50" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Sales</p>
                        <p className="mt-2 text-3xl font-bold">Analyze</p>
                      </div>
                      <BarChart3 className="h-10 w-10 text-primary opacity-50" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Customers</p>
                        <p className="mt-2 text-3xl font-bold">Engage</p>
                      </div>
                      <Users className="h-10 w-10 text-primary opacity-50" />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold">System Overview</p>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Active</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-sm">Real-time inventory tracking</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-sm">Multi-user access control</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-sm">Comprehensive reporting</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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

        {/* CTA Section */}
        <section id="contact" className="py-20">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-12 text-center shadow-lg">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {content.contactTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.contactSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/auth/login">
                <Button size="lg" className="rounded-lg px-8 text-base">
                  Sign In Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="mailto:support@groceryos.com">
                <Button variant="outline" size="lg" className="rounded-lg px-8 text-base">
                  Contact Support
                </Button>
              </a>
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
              <a href="#about" className="text-sm text-muted-foreground transition hover:text-primary">
                About
              </a>
              <a href="mailto:support@groceryos.com" className="text-sm text-muted-foreground transition hover:text-primary">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
