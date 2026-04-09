# StockExchangeRN

React Native / Expo версия приложения `Stock-Exchange-master`, доведённая для теста в Android Emulator.

## Что уже подготовлено

- проект запускается как **Expo app** в Android-эмуляторе;
- добавлены недостающие зависимости для React Navigation;
- подключён `react-native-gesture-handler`;
- `BASE_URL` можно менять через `.env` без правки кода;
- оставлены скрипты и для быстрого запуска, и для полного нативного Android prebuild;
- поведение UI приведено ближе к Kotlin-версии.

## Быстрый запуск в Android Emulator

### 1) Что должно быть установлено

- Node.js 18+ или 20+
- Android Studio
- Android SDK
- созданный и запущенный Android Emulator

### 2) Установка зависимостей

```bash
npm install
```

### 3) Запуск в эмуляторе

```bash
npm run android
```

Эта команда поднимет Expo и отправит приложение в уже запущенный Android Emulator.

## Если хочешь поменять backend URL

Создай файл `.env` рядом с `package.json`:

```bash
EXPO_PUBLIC_API_URL=https://song-analysis.app/
```

Для локального backend в Android Emulator обычно используют:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/
```

## Нативный Android build

Если нужен именно нативный Android shell, а не только Expo запуск:

```bash
npm run native:android
```

Команда сначала заново сгенерирует `android/` через Expo prebuild, а затем соберёт приложение для эмулятора.

## Полезные команды

```bash
npm run lint
npm run doctor
npm run prebuild:android
```

## Важно

Текущая версия использует удалённый backend по умолчанию:

```text
https://song-analysis.app/
```

Если backend у тебя локальный, обязательно поменяй `EXPO_PUBLIC_API_URL` в `.env`.
