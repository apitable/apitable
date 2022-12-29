import { ITheme } from './../theme/theme.interface';
import { useTheme } from './use_provider_theme';

export const useThemeColors = (): ITheme['color'] => {
  const theme = useTheme();
  return theme.color;
};
