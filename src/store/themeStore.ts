import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'stock_exchange_theme';

type ThemeState = {
  isReady: boolean;
  isDark: boolean;
  hydrate: () => Promise<void>;
  setDark: (value: boolean) => Promise<void>;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isReady: false,
  isDark: false,
  hydrate: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    set({ isDark: raw === 'dark', isReady: true });
  },
  setDark: async (value) => {
    await AsyncStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light');
    set({ isDark: value });
  },
}));
