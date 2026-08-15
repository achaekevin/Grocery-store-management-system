import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '@types/index';

// Synchronously recover session from localStorage on boot
const token = localStorage.getItem('token');
let user: User | null = null;
try {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    user = JSON.parse(userStr);
  }
} catch (e) {
  user = null;
}

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!(token && user),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    restoreAuth: (state) => {
      const storedToken = localStorage.getItem('token');
      const storedUserStr = localStorage.getItem('user');
      if (storedToken && storedUserStr) {
        try {
          state.token = storedToken;
          state.user = JSON.parse(storedUserStr);
          state.isAuthenticated = true;
        } catch (e) {
          state.isAuthenticated = false;
        }
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  restoreAuth,
} = authSlice.actions;

export default authSlice.reducer;
