import { AxiosError } from 'axios';
import { ErrorResponse } from '../types/api';

function getApiErrorPayload(error: unknown): ErrorResponse | null {
  if (error instanceof AxiosError) {
    return (error.response?.data as ErrorResponse | undefined) ?? null;
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
  const fallback = 'Произошла ошибка сети';
  const payload = getApiErrorPayload(error);
  if (!payload) return getNetworkErrorMessage(error, fallback);

  switch (payload.code) {
    case 'VALIDATION_ERROR':
      return payload.message;
    case 'USER_ALREADY_EXISTS':
      return 'Пользователь с таким логином уже существует';
    case 'INVALID_CREDENTIALS':
      return 'Неверный логин или пароль';
    default:
      return payload.message || fallback;
  }
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
