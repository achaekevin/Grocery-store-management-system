import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import cartReducer from './slices/cartSlice';
import notificationReducer from './slices/notificationSlice';
import customerPortalReducer from './slices/customerPortalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    cart: cartReducer,
    notifications: notificationReducer,
    customerPortal: customerPortalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
