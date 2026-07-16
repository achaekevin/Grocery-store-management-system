import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  ChevronRight,
  Languages,
  Leaf,
  Moon,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Sun,
  TrendingUp,
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
  secondaryCta: string;
  statsTitle: string;
  featuresTitle: string;
  featuresSubtitle: string;
  pricingTitle: string;
  pricingSubtitle: string;
  testimonialsTitle: string;
  faqTitle: string;
  aboutTitle: string;
  aboutBody: string;
  contactTitle: string;
  contactBody: string;
  footer: string;
}

const copy: Record<Language, CopyContent> = {
  en: {
    eyebrow: 'Smarter retail for growing grocery brands',
    title: 'Run every store, shelf, and checkout from one calm command center.',
    subtitle:
      'GroceryOS helps modern retailers manage inventory, payments, suppliers, and customer loyalty without the usual chaos.',
    primaryCta: 'Start free demo',
    secondaryCta: 'See product tour',
    statsTitle: 'Trusted by fast-moving grocery businesses',
    featuresTitle: 'Everything your store team needs',
    featuresSubtitle: 'From stock control to customer loyalty, each module is designed to save time and reduce shrink.',
    pricingTitle: 'Choose a plan that grows with your business',
    pricingSubtitle: 'Launch with the essentials or unlock advanced forecasting and multi-branch automation.',
    testimonialsTitle: 'What store owners are saying',
    faqTitle: 'Frequently asked questions',
    aboutTitle: 'Built for Kenyan and regional retail teams',
    aboutBody:
      'We combine inventory intelligence, simple reporting, and effortless POS workflows so your teams can serve customers faster and make better decisions.',
    contactTitle: 'Ready to modernize your grocery operations?',
    contactBody: 'Book a tailored walkthrough and see how GroceryOS fits your chain, warehouse, and neighborhood branches.',
    footer: '© 2026 GroceryOS. Built for modern retail teams.',
  },
  sw: {
    eyebrow: 'Uendeshaji wa reja reja kwa biashara za mboga zinazoendelea',
    title: 'Endesha duka, rafu, na malipo yote kutoka kituo kimoja kilicho na utulivu.',
    subtitle:
      'GroceryOS husaidia wafanyabiashara wa mboga kudhibiti hesabu, malipo, wasambazaji, na uaminifu wa wateja bila machafuko ya kawaida.',
    primaryCta: 'Anza onyesho la bure',
    secondaryCta: 'Angalia ziara ya bidhaa',
    statsTitle: 'Inategemewa na biashara za mboga zinazokua haraka',
    featuresTitle: 'Kila kitu timu yako ya duka inachohitaji',
    featuresSubtitle: 'Kutoka udhibiti wa hisa hadi uaminifu wa wateja, kila moduli imeundwa kuokoa muda na kupunguza hasara.',
    pricingTitle: 'Chagua mpango unaokua na biashara yako',
    pricingSubtitle: 'Anza na mambo ya msingi au fungua utabiri wa hali ya juu na u automatishaji wa matawi mengi.',
    testimonialsTitle: 'Wamiliki wa maduka wanavyosema',
    faqTitle: 'Maswali yanayoulizwa mara kwa mara',
    aboutTitle: 'Imejengwa kwa timu za rejareja za Kenya na eneo lote',
    aboutBody:
      'Tunachanganya akili ya hisa, ripoti rahisi, na utendakazi wa POS wa urahisi ili timu zako zipeleke huduma kwa wateja haraka na kufanya maamuzi bora.',
    contactTitle: 'Uko tayari kuboresha utendakazi wa duka lako la mboga?',
    contactBody: 'Panga ziara iliyobinafsishwa uone jinsi GroceryOS inavyoendana na mnyororo wako, ghala, na matawi ya kijiji.',
    footer: '© 2026 GroceryOS. Imejengwa kwa timu za rejareja za kisasa.',
  },
};

const stats = [
  { label: 'Live branches', value: '120+' },
  { label: 'Transactions/day', value: '24k' },
  { label: 'Stock accuracy', value: '99.2%' },
];

const features: Array<{ title: string; description: string; icon: LucideIcon }> = [
  { title: 'Smart stock control', description: 'Receive low-stock alerts and keep shelves replenished in real time.', icon: Package },
  { title: 'Fast POS checkout', description: 'Speed up queues with flexible pricing, returns, and payment workflows.', icon: ShoppingCart },
  { title: 'Loyalty & CRM', description: 'Build repeat visits with digital rewards and segmented customer insights.', icon: BadgeCheck },
  { title: 'Actionable analytics', description: 'Turn branch performance into decisions with live dashboards and reports.', icon: BarChart3 },
];

const plans = [
  { name: 'Starter', price: '$49', description: 'For single-location retailers who need essential control.', perks: ['POS + inventory', 'Basic reports', 'Email support'] },
  { name: 'Growth', price: '$129', description: 'For multi-branch teams that need automation and insights.', perks: ['Unlimited branches', 'Loyalty tools', 'Advanced analytics'], featured: true },
  { name: 'Enterprise', price: 'Custom', description: 'For chains with integrations, custom roles, and dedicated onboarding.', perks: ['White-glove setup', 'API access', 'Priority support'] },
];

const testimonials = [
  { quote: 'We cut stockouts by nearly 40% in one month.', author: 'Amina, Manager at Fresh Basket' },
  { quote: 'Our checkout lines moved faster and the team loves the dashboards.', author: 'Daniel, Owner at City Mart' },
];

const faqs = [
  { question: 'Can I use GroceryOS for one store or many branches?', answer: 'Yes. You can start with one outlet and expand to multiple branches whenever you are ready.' },
  { question: 'Does it support local payment methods?', answer: 'The platform is designed to fit modern retail operations with flexible payment and reporting workflows.' },
  { question: 'How quickly can we get started?', answer: 'Most teams are productive in days with a guided onboarding process and ready templates.' },
];

export const LandingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const [language, setLanguage] = useState<Language>('en');
  const content = useMemo(() => copy[language], [language]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(240,249,255,0.95))] text-foreground dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.2),_transparent_35%),linear-gradient(135deg,_#020617,_#0f172a)]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg">
            G
          </div>
          <div>
            <p className="text-sm font-semibold">GroceryOS</p>
            <p className="text-xs text-muted-foreground">Retail intelligence</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">Features</a>
          <a href="#pricing" className="transition hover:text-foreground">Pricing</a>
          <a href="#about" className="transition hover:text-foreground">About</a>
          <a href="#contact" className="transition hover:text-foreground">Contact</a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage((prev) => (prev === 'en' ? 'sw' : 'en'))}
            className="flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-2 text-sm shadow-sm backdrop-blur"
          >
            <Languages className="h-4 w-4" />
            {language === 'en' ? 'EN' : 'SW'}
          </button>
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="rounded-full border border-border bg-background/70 p-2.5 shadow-sm backdrop-blur"
            aria-label="Toggle theme"
          >
            {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-16 lg:px-8">
        <section className="grid items-center gap-10 rounded-[2rem] border border-white/50 bg-background/70 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
              {content.eyebrow}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{content.subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth/login">
                <Button size="lg" className="rounded-full px-6">
                  {content.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="rounded-full px-6">
                  {content.secondaryCta}
                </Button>
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/80 bg-card/70 p-4 shadow-sm">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="relative overflow-hidden rounded-[2rem] border border-border bg-card/90 p-6 shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.2),_transparent_45%)]" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Branch overview</p>
                  <p className="text-sm text-muted-foreground">Live sales and stock health</p>
                </div>
                <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Daily sales</p>
                  <p className="mt-2 text-3xl font-semibold">KSh 184k</p>
                  <p className="mt-2 text-sm text-emerald-600">+12.4% vs yesterday</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-sm text-muted-foreground">Low stock alerts</p>
                  <p className="mt-2 text-3xl font-semibold">18</p>
                  <p className="mt-2 text-sm text-primary">Priority replenishment</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold">Today’s operations</p>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">On track</span>
                </div>
                <div className="space-y-3">
                  {['Milk crates restocked', 'Loyalty rewards sent', 'Supplier invoices approved'].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-xl border border-border/80 bg-card/70 px-3 py-2 text-sm">
                      <Leaf className="h-4 w-4 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="rounded-[2rem] border border-border/80 bg-card/70 p-8 shadow-lg backdrop-blur lg:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{content.featuresTitle}</p>
            <h2 className="mt-2 text-3xl font-semibold">{content.featuresSubtitle}</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} whileHover={{ y: -4 }} className="rounded-2xl border border-border bg-background/80 p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="pricing" className="rounded-[2rem] border border-border/80 bg-background/70 p-8 shadow-lg backdrop-blur lg:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{content.pricingTitle}</p>
            <h2 className="mt-2 text-3xl font-semibold">{content.pricingSubtitle}</h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-3xl border p-6 shadow-sm ${plan.featured ? 'border-primary bg-primary/5 shadow-lg' : 'border-border bg-card/70'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {plan.featured && <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Popular</span>}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-6 text-4xl font-semibold">{plan.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">per month</p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full rounded-full" variant={plan.featured ? 'primary' : 'outline'}>
                  Choose plan
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-border/80 bg-card/70 p-8 shadow-lg backdrop-blur lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Live preview</p>
            <h2 className="mt-2 text-3xl font-semibold">A calm view of your store operations</h2>
            <p className="mt-4 text-muted-foreground">Every dashboard, stock movement, and sale is surfaced in a way your managers can read in seconds.</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
              <BrainCircuit className="h-4 w-4" />
              AI-assisted insights built in
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-background/80 p-5 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Sales trend</p>
                <div className="mt-3 h-24 rounded-xl bg-gradient-to-r from-emerald-500/20 to-primary/20" />
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Inventory health</p>
                <div className="mt-3 flex items-end gap-2">
                  {[46, 76, 82, 66, 90].map((height) => (
                    <div key={height} className="flex-1 rounded-t-xl bg-primary/80" style={{ height: `${height}px` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border/80 bg-background/70 p-8 shadow-lg backdrop-blur lg:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{content.testimonialsTitle}</p>
            <h2 className="mt-2 text-3xl font-semibold">Retailers love the rhythm of a simpler workflow</h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm">
                <p className="text-lg leading-8 text-muted-foreground">“{testimonial.quote}”</p>
                <p className="mt-4 font-semibold">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="grid gap-6 rounded-[2rem] border border-border/80 bg-card/70 p-8 shadow-lg backdrop-blur lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{content.aboutTitle}</p>
            <h2 className="mt-2 text-3xl font-semibold">Built for the realities of everyday retail</h2>
            <p className="mt-4 text-muted-foreground">{content.aboutBody}</p>
          </div>
          <div className="rounded-3xl border border-border bg-background/80 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Multi-branch ready</p>
                <p className="text-sm text-muted-foreground">Keep all locations aligned without extra complexity.</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Secure by design</p>
                <p className="text-sm text-muted-foreground">Built-in role permissions and audit-friendly workflows.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border/80 bg-background/70 p-8 shadow-lg backdrop-blur lg:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{content.faqTitle}</p>
            <h2 className="mt-2 text-3xl font-semibold">Questions that come up before switching systems</h2>
          </div>
          <div className="mt-8 space-y-3">
            {faqs.map((item) => (
              <details key={item.question} className="rounded-2xl border border-border bg-card/70 p-4">
                <summary className="cursor-pointer font-medium">{item.question}</summary>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="rounded-[2rem] border border-primary/20 bg-primary/10 p-8 shadow-lg backdrop-blur lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{content.contactTitle}</p>
              <h2 className="mt-2 text-3xl font-semibold">{content.contactBody}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth/login">
                <Button size="lg" className="rounded-full px-6">
                  {content.primaryCta}
                </Button>
              </Link>
              <a href="mailto:hello@groceryos.co.ke">
                <Button variant="outline" size="lg" className="rounded-full px-6">
                  hello@groceryos.co.ke
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 bg-background/70 px-6 py-8 text-center text-sm text-muted-foreground lg:px-8">
        {content.footer}
      </footer>
    </div>
  );
};
