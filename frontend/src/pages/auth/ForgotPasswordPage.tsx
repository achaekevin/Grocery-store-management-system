import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { forgotPasswordSchema } from '@utils/validation';
import { useToast } from '@hooks/useToast';

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPasswordPage: React.FC = () => {
  const { success } = useToast();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    
    // Mock API call
    setTimeout(() => {
      success('Password reset link sent to your email!');
      setEmailSent(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-8">
      <Link
        to="/auth/login"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Forgot Password?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {emailSent
            ? "We've sent a password reset link to your email address"
            : 'Enter your email address and we'll send you a reset link'}
        </p>
      </div>

      {!emailSent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email Address</label>
            <Input
              type="email"
              placeholder="admin@groceryos.co.ke"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Send Reset Link
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
            Check your email for a link to reset your password. If it doesn't appear within a few
            minutes, check your spam folder.
          </div>
          <Link to="/auth/login">
            <Button className="w-full">Return to Login</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
