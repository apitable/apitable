import { light } from './light';
import { dark } from './dark';
import { DefaultTheme } from 'styled-components';
import { ITheme } from './theme.interface';

export * from './dark';
export * from './light';
export * from './theme.interface';
export const defaultTheme = light;
export const darkTheme = dark;

interface IProps {
  [x: string]: any;
  theme?: ITheme | {};
  className?: string;
}

export function applyDefaultTheme({ theme = {}, className, ...props }: IProps) {
  // Since styled-components defaults the `theme` prop to an empty object
  // inside of the styled component if a ThemeProvider is not present,
  // we check against the number of keys.
  return {
    ...props,
    theme: (Object.keys(theme).length === 0 ? defaultTheme : theme) as DefaultTheme,
  };
}