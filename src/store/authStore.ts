import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { AuthResponse } from '../types/api';

const STORAGE_KEY = 'stock_exchange_auth';

type AuthMeta = {
  isRegistration?: boolean;
};

type PersistedAuth = {
  userId: string | null;
  login: string | null;
  portfolioId: string | null;
  accessToken: string | null;
  registeredAt: string | null;
  lastAuthAt: string | null;
};

type AuthState = PersistedAuth & {
  isReady: boolean;
  hydrate: () => Promise<void>;
  setAuth: (payload: AuthResponse, meta?: AuthMeta) => Promise<void>;
  logout: () => Promise<void>;
};

const EMPTY_STATE: PersistedAuth = {
  userId: null,
  login: null,
  portfolioId: null,
  accessToken: null,
  registeredAt: null,
  lastAuthAt: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isReady: false,
  ...EMPTY_STATE,
  hydrate: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedAuth;
      const migratedRegisteredAt = parsed.registeredAt ?? (parsed.accessToken ? new Date().toISOString() : null);
      const nextState: PersistedAuth = {
        ...EMPTY_STATE,
        ...parsed,
        registeredAt: migratedRegisteredAt,
      };
      if (migratedRegisteredAt !== parsed.registeredAt) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      }
      set({ ...nextState, isReady: true });
      return;
    }
    set({ isReady: true });
  },
  setAuth: async (payload, meta) => {
    const now = new Date().toISOString();
    const prev = get();
    const isSameUser = prev.userId === payload.userId;
    const registeredAt = meta?.isRegistration ? now : isSameUser ? prev.registeredAt ?? now : now;
    const nextState: PersistedAuth = {
      userId: payload.userId,
      login: payload.login,
      portfolioId: payload.portfolioId,
      accessToken: payload.accessToken,
      registeredAt,
      lastAuthAt: now,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    set(nextState);
  },
  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ ...EMPTY_STATE });
  },
}));
