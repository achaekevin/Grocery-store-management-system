import apiService from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roleId: string;
  branchId?: string;
  businessId: string;
  status: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    role: any;
    business: any;
    branch?: any;
    tokens: AuthTokens;
    requiresTwoFactor?: boolean;
  };
}

export interface RegisterData {
  businessName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address?: string;
  taxId?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
}

export const authApi = {
  // Register new business
  register: (data: RegisterData) => {
    return apiService.post<LoginResponse>('/v1/auth/register', data);
  },

  // Login
  login: async (data: LoginData) => {
    const response = await apiService.post<LoginResponse>('/v1/auth/login', data);

    // Store tokens if login successful
    if (response.success && response.data.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Logout
  logout: async () => {
    try {
      await apiService.post('/v1/auth/logout');
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    const response = await apiService.post<{ success: boolean; data: AuthTokens }>(
      '/v1/auth/refresh',
      { refreshToken }
    );

    if (response.success && response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response;
  },

  // Get current user
  getCurrentUser: () => {
    return apiService.get<{ success: boolean; data: { user: User; role: any; business: any; branch?: any } }>(
      '/v1/auth/me'
    );
  },

  // Change password
  changePassword: (data: ChangePasswordData) => {
    return apiService.put('/v1/auth/change-password', data);
  },

  // Forgot password
  forgotPassword: (email: string) => {
    return apiService.post('/v1/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: (token: string, password: string, confirmPassword: string) => {
    return apiService.post('/v1/auth/reset-password', {
      token,
      password,
      confirmPassword,
    });
  },

  // Send email verification
  sendEmailVerification: () => {
    return apiService.post('/v1/auth/send-verification');
  },

  // Verify email
  verifyEmail: (token: string) => {
    return apiService.post('/v1/auth/verify-email', { token });
  },

  // Two-Factor Authentication
  twoFactor: {
    // Enable 2FA
    enable: () => {
      return apiService.post<{ success: boolean; data: TwoFactorSetup }>('/v1/auth/2fa/enable');
    },

    // Verify and activate 2FA
    verify: (token: string) => {
      return apiService.post<{ success: boolean; data: { backupCodes: string[] } }>(
        '/v1/auth/2fa/verify',
        { token }
      );
    },

    // Disable 2FA
    disable: (password: string) => {
      return apiService.post('/v1/auth/2fa/disable', { password });
    },

    // Verify 2FA code during login
    verifyLogin: (userId: string, token: string) => {
      return apiService.post<LoginResponse>('/v1/auth/2fa/login', {
        userId,
        token,
      });
    },
  },
};

export default authApi;
