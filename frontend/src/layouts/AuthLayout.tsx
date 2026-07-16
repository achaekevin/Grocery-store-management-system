import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { toggleTheme } from '@store/slices/themeSlice';

export const AuthLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(240,249,255,0.95))] px-4 py-6 text-foreground dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.2),_transparent_35%),linear-gradient(135deg,_#020617,_#0f172a)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="flex-1 rounded-[2rem] border border-white/60 bg-background/70 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl lg:p-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
                G
              </div>
              <div>
                <p className="text-lg font-semibold">GroceryOS</p>
                <p className="text-sm text-muted-foreground">Secure retail control center</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="rounded-full border border-border bg-background/80 p-2.5 shadow-sm"
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Trusted by modern grocery teams
              </div>
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">Welcome back to your storefront command center.</h1>
                <p className="mt-3 max-w-xl text-lg leading-8 text-muted-foreground">
                  Manage inventory, loyalty, and daily sales from one secure workspace with a calm, modern experience.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  <ArrowLeft className="h-4 w-4" />
                  Back to landing page
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Instant insights', value: '24/7' },
                  { label: 'Secure sign-in', value: 'OTP ready' },
                  { label: 'Less stock loss', value: '-35%' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
                    <p className="text-xl font-semibold">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/70 bg-background/90 p-5 shadow-xl">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
