import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { restoreAuth } from '@store/slices/authSlice';
import { setTheme } from '@store/slices/themeSlice';
import { useToast } from '@hooks/useToast';
import { ToastContainer } from '@components/ui/Toast';

function App() {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    // Restore authentication state
    dispatch(restoreAuth());

    // Apply theme
    dispatch(setTheme(mode));
  }, [dispatch, mode]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default App;
