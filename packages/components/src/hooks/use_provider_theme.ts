import { ITheme } from './../theme/theme.interface';
import { defaultTheme } from 'theme';
import { useTheme as useScTheme } from 'styled-components';

export const useProviderTheme = (): ITheme => {
  return useScTheme() || defaultTheme;
};

export const useTheme = useProviderTheme;