// snackbarStore.ts
import {create} from 'zustand';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
  showSnackbar: (message: string, severity: 'success' | 'error') => void;
  closeSnackbar: () => void;
}

const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: '',
  severity: 'success',
  showSnackbar: (message: string, severity: 'success' | 'error') =>
    set({ open: true, message, severity }),
  closeSnackbar: () => set({ open: false}),
}));

export default useSnackbarStore;
