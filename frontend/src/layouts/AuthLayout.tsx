import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { toggleTheme } from '@store/slices/themeSlice';

export const AuthLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(240,249,255,0.95))] px-4 py-12 dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.2),_transparent_35%),linear-gradient(135deg,_#020617,_#0f172a)]">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-white/60 bg-background/90 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
          {/* Header with Logo and Theme Toggle */}
          <div className="mb-8 flex items-center justify-between">
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
              className="rounded-full border border-border bg-background/80 p-2.5 shadow-sm hover:bg-accent"
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          {/* Auth Form Content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};
