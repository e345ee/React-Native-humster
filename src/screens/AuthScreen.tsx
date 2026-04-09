import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import { login, register, getApiErrorMessage } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { usePalette } from '../theme/usePalette';
import { showToast } from '../utils/toast';

export default function AuthScreen() {
  const [form, setForm] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const palette = usePalette();

  const validate = (isRegistration = false) => {
    if (!form.login.trim()) {
      showToast('Введите логин');
      return false;
    }
    if (!form.password.trim()) {
      showToast('Введите пароль');
      return false;
    }
    if (isRegistration && form.password.trim().length < 8) {
      showToast('Пароль должен содержать минимум 8 символов');
      return false;
    }
    return true;
  };

  const submit = async (type: 'login' | 'register') => {
    if (!validate(type === 'register')) return;
    try {
      setLoading(true);
      const payload = { login: form.login.trim(), password: form.password.trim() };
      const response = type === 'login' ? await login(payload) : await register(payload);
      await setAuth(response, { isRegistration: type === 'register' });
      if (type === 'register') showToast('Регистрация успешна!');
    } catch (error) {
      showToast(getApiErrorMessage(error), 'long');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={[styles.title, { color: palette.text }]}>Вход / Регистрация</Text>

          <Text style={[styles.inputLabel, { color: palette.secondaryText }]}>Логин</Text>
          <TextInput
            value={form.login}
            onChangeText={(loginValue: string) => setForm((prev) => ({ ...prev, login: loginValue }))}
            style={[styles.input, { color: palette.text, borderColor: palette.border, backgroundColor: palette.surface }]}
            autoCapitalize="none"
            placeholder="Логин"
            placeholderTextColor={palette.secondaryText}
          />

          <Text style={[styles.inputLabel, { color: palette.secondaryText }]}>Пароль</Text>
          <TextInput
            value={form.password}
            onChangeText={(password: string) => setForm((prev) => ({ ...prev, password }))}
            secureTextEntry
            style={[styles.input, { color: palette.text, borderColor: palette.border, backgroundColor: palette.surface }]}
            placeholder="Пароль"
            placeholderTextColor={palette.secondaryText}
          />

          <Pressable style={[styles.primaryButton, { backgroundColor: palette.primary }]} disabled={loading} onPress={() => submit('login')}>
            <Text style={styles.primaryButtonText}>{loading ? 'Подождите...' : 'Войти'}</Text>
          </Pressable>
          <Pressable style={[styles.secondaryButton, { borderColor: palette.border }]} disabled={loading} onPress={() => submit('register')}>
            <Text style={[styles.secondaryButtonText, { color: palette.text }]}>Зарегистрироваться</Text>
          </Pressable>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 24,
  },
  card: {
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
