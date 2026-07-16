import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, Store } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { loginSchema } from '@utils/validation';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { loginSuccess } from '@store/slices/authSlice';
import { useToast } from '@hooks/useToast';
import { LoginCredentials } from '@types/index';
import { USERS } from '@services/mockData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { success, error } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true);

    setTimeout(() => {
      const user = USERS.find((u) => u.email === data.email);

      if (user) {
        dispatch(
          loginSuccess({
            user,
            token: 'mock-jwt-token-' + Date.now(),
          })
        );
        success('Login successful!');
        navigate('/dashboard');
      } else {
        error('Invalid credentials');
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Sign in to GroceryOS</h2>
        <p className="text-sm text-muted-foreground">
          Securely access your inventory, team tools, and customer insights.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>New: faster checkout and live supplier updates are now on by default.</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="admin@groceryos.co.ke"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              {...register('remember')}
            />
            <span className="text-sm">Remember me</span>
          </label>
          <Link to="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="rounded-2xl border border-border bg-card/80 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <ShieldCheck className="h-4 w-4" />
          Security highlights
        </div>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Role-based access for managers and cashiers
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Audit-friendly logs for daily operations
          </li>
        </ul>
      </div>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don&apos;t have an account? </span>
        <Link to="/auth/register" className="font-medium text-primary hover:underline">
          Register your business
        </Link>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        <p className="mb-2 font-semibold uppercase tracking-[0.2em]">Demo credentials</p>
        <div className="space-y-1">
          <div><strong>Email:</strong> john@groceryos.co.ke</div>
          <div><strong>Password:</strong> <em>any password</em></div>
        </div>
      </div>
    </div>
  );
};
