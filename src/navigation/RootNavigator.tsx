import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import StockDetailsScreen from '../screens/StockDetailsScreen';
import MainTabs from './MainTabs';
import { RootStackParamList } from './types';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { usePalette } from '../theme/usePalette';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const authReady = useAuthStore((state) => state.isReady);
  const token = useAuthStore((state) => state.accessToken);
  const login = useAuthStore((state) => state.login);
  const hydrateTheme = useThemeStore((state) => state.hydrate);
  const themeReady = useThemeStore((state) => state.isReady);
  const palette = usePalette();

  useEffect(() => {
    hydrateAuth();
    hydrateTheme();
  }, [hydrateAuth, hydrateTheme]);

  if (!authReady || !themeReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.background }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} initialParams={{ username: login ?? undefined }} />
          <Stack.Screen name="StockDetails" component={StockDetailsScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}
