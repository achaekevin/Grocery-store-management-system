import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { registerBusinessSchema } from '@utils/validation';
import { useToast } from '@hooks/useToast';
import { RegisterBusinessData } from '@types/index';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterBusinessData>({
    resolver: zodResolver(registerBusinessSchema),
  });

  const onSubmit = async (data: RegisterBusinessData) => {
    setLoading(true);
    
    // Mock registration
    setTimeout(() => {
      success('Business registered successfully! Please check your email to verify your account.');
      setLoading(false);
      navigate('/auth/login');
    }, 1500);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Register Your Business</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start managing your multi-branch grocery store
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Business Name</label>
          <Input
            type="text"
            placeholder="Acme Grocery Stores"
            icon={<Building2 className="h-4 w-4" />}
            error={errors.businessName?.message}
            {...register('businessName')}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Email Address</label>
          <Input
            type="email"
            placeholder="admin@yourbusiness.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
          <Input
            type="tel"
            placeholder="+254700000000"
            icon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
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

        <div>
          <label className="mb-1.5 block text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-input" required />
          <label className="text-sm text-muted-foreground">
            I agree to the{' '}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link to="/auth/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};
