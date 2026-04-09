import { AxiosError } from 'axios';
import { ErrorResponse } from '../types/api';

function getApiRawData(error: unknown): unknown {
  if (error instanceof AxiosError) {
    return error.response?.data;
  }
  return null;
}

function getApiErrorPayload(error: unknown): ErrorResponse | null {
  const raw = getApiRawData(error);
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as ErrorResponse;
    } catch {
      return null;
    }
  }
  if (typeof raw === 'object' && raw !== null && 'code' in raw && 'message' in raw) {
    return raw as ErrorResponse;
  }
  return null;
}

function getApiStatus(error: unknown): number | null {
  if (error instanceof AxiosError) {
    return error.response?.status ?? null;
  }
  return null;
}

function getNetworkErrorMessage(error: unknown, fallback = 'Ошибка сети'): string {
  const payload = getApiErrorPayload(error);
  if (payload?.message) return payload.message;
  if (error instanceof AxiosError) {
    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const raw = error.response?.data;

    if (raw == null) {
      return error.response ? 'Неизвестная ошибка' : `Ошибка сети: ${error.message}`;
    }

    const payload = getApiErrorPayload(error);
    if (payload) {
      switch (payload.code) {
        case 'VALIDATION_ERROR':
          return payload.message;
        case 'USER_ALREADY_EXISTS':
          return 'Пользователь с таким логином уже существует';
        case 'INVALID_CREDENTIALS':
          return 'Неверный логин или пароль';
        default:
          return payload.message;
      }
    }

    if (typeof raw === 'string') {
      return `Ошибка: ${raw}`;
    }

    return 'Неизвестная ошибка';
  }

  if (error instanceof Error) {
    return `Ошибка сети: ${error.message}`;
  }

  return 'Неизвестная ошибка';
}

export function getProfileErrorMessage(error: unknown): string {
  const status = getApiStatus(error);
  if (status === 401) return 'Ошибка 401: Требуется авторизация';
  if (status === 403) return 'Ошибка 403: Нет доступа';
  if (status === 404) return 'Ошибка 404: Портфолио не найдено';
  if (typeof status === 'number') return `Ошибка ${status}: ${getNetworkErrorMessage(error, 'Неизвестная ошибка')}`;
  return `Ошибка: ${getNetworkErrorMessage(error, 'Неизвестная ошибка')}`;
}

export function getTradeErrorMessage(error: unknown): string {
  const status = getApiStatus(error);
  if (status === 400) return 'Ошибка: Неверный запрос';
  if (status === 401) return 'Ошибка: Не авторизован';
  if (status === 403) return 'Ошибка: Нет прав';
  if (status === 404) return 'Ошибка: Акция не найдена';
  if (typeof status === 'number') return `Ошибка: ${status}`;
  return `Ошибка: ${getNetworkErrorMessage(error, 'Неизвестная ошибка')}`;
}

export function getStatisticsErrorMessage(error: unknown): string {
  return `Ошибка загрузки статистики: ${getNetworkErrorMessage(error, 'неизвестная ошибка')}`;
}
