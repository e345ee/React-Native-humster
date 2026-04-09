import { colors } from './colors';
import { useThemeStore } from '../store/themeStore';

export const usePalette = () => {
  const isDark = useThemeStore((state) => state.isDark);
  return isDark ? colors.dark : colors.light;
};
