import { ThemeName } from '../theme/theme.interface';
import { useTheme } from './use_provider_theme';

export const useThemeMode = (): ThemeName => {
  const theme = useTheme();
  return theme.palette.type || ThemeName.Light;
};
