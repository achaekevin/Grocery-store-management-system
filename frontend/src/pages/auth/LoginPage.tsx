import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { loginSchema } from '@utils/validation';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { loginSuccess } from '@store/slices/authSlice';
import { useToast } from '@hooks/useToast';
import { LoginCredentials } from '@types/index';
import { authApi } from '@services/auth.api';

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

    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        // Check if 2FA is required
        if (response.data.requiresTwoFactor) {
          navigate('/auth/verify-2fa', { state: { userId: response.data.user.id } });
          return;
        }

        // Construct complete user object with role and business
        const fullUser = {
          ...response.data.user,
          role: response.data.role || response.data.user?.role || { id: '', name: 'Super Admin', slug: 'super-admin' },
          business: response.data.business || response.data.user?.business,
          branch: response.data.branch || response.data.user?.branch,
        };

        // Dispatch login success to Redux store
        dispatch(
          loginSuccess({
            user: fullUser,
            token: response.data.tokens.accessToken,
          })
        );

        success('Login successful!');

        const roleName = fullUser.role?.name || (fullUser.role as any);
        if (roleName === 'Customer') {
          navigate('/customer/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Sign in to GroceryOS</h2>
        <p className="text-sm text-muted-foreground">
          Securely access your inventory, team tools, and customer insights.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="admin@groceryos.com"
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

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don&apos;t have an account? </span>
        <Link to="/auth/register" className="font-medium text-primary hover:underline">
          Register your business
        </Link>
      </div>
    </div>
  );
};
