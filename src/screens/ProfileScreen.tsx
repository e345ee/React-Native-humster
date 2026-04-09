import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import { getPortfolioStatistics } from '../api/portfolio';
import { PortfolioStatisticsResponse } from '../types/api';
import { formatDisplayDate, formatMoney } from '../utils/format';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { usePalette } from '../theme/usePalette';
import { getProfileErrorMessage } from '../utils/apiError';
import { showToast } from '../utils/toast';
import { MainTabParamList } from '../navigation/types';

type ProfileRoute = RouteProp<MainTabParamList, 'Профиль'>;

export default function ProfileScreen() {
  const route = useRoute<ProfileRoute>();
  const [stats, setStats] = useState<PortfolioStatisticsResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const loginFromStore = useAuthStore((state) => state.login);
  const login = route.params?.username ?? loginFromStore ?? 'Пользователь';
  const logout = useAuthStore((state) => state.logout);
  const registeredAt = useAuthStore((state) => state.registeredAt);
  const isDark = useThemeStore((state) => state.isDark);
  const setDark = useThemeStore((state) => state.setDark);
  const palette = usePalette();

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await getPortfolioStatistics();
      setStats(response);
    } catch (error) {
      showToast(getProfileErrorMessage(error), 'long');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = useCallback(async () => {
    showToast('Вы вышли из системы');
    await logout();
  }, [logout]);

  return (
    <Screen refreshing={refreshing} onRefresh={load}>
      <View style={styles.center}>
        <Card style={[styles.avatarCard, { backgroundColor: palette.surface }]}> 
          <Text style={styles.avatar}>👤</Text>
        </Card>
      </View>

      <Text style={[styles.userName, { color: palette.text }]}>{login}</Text>
      <Text style={[styles.email, { color: palette.secondaryText }]} numberOfLines={1}>
        {`${login}@example.com`.toLowerCase()}
      </Text>

      <Card>
        <Text style={[styles.cardTitle, { color: palette.text }]}>Финансовая информация</Text>
        <Row label="Баланс:" value={formatMoney(stats?.cashBalance ?? 0)} valueColor={palette.success} />
        <Divider />
        <Row label="Всего сделок:" value={String(stats?.totalTransactions ?? 0)} />
        <Divider />
        <Row label="Дата регистрации:" value={formatDisplayDate(registeredAt)} />
      </Card>

      <Card>
        <Text style={[styles.cardTitle, { color: palette.text }]}>Настройки</Text>
        <View style={styles.settingsRow}>
          <Text style={[styles.label, { color: palette.text }]}>Тёмная тема</Text>
          <Switch value={isDark} onValueChange={setDark} />
        </View>
      </Card>

      <Pressable style={[styles.logoutButton, { borderColor: palette.danger, backgroundColor: palette.danger }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Выйти из аккаунта</Text>
      </Pressable>
    </Screen>
  );
}

function Divider() {
  const palette = usePalette();
  return <View style={[styles.divider, { backgroundColor: palette.border }]} />;
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  const palette = usePalette();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor ?? palette.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  avatarCard: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  avatar: { fontSize: 48 },
  userName: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  email: { fontSize: 14, textAlign: 'center', marginTop: 2, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { flex: 1, fontSize: 15 },
  value: { fontSize: 15, fontWeight: '700' },
  divider: { height: 1, marginVertical: 12 },
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoutButton: {
    marginTop: -8,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
