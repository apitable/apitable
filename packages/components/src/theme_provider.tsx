/* eslint-disable @typescript-eslint/no-use-before-define */
import { getThemeName } from 'helper/colors';
import React from 'react';
import { ThemeProvider as Provider, ThemeContext as Context } from 'styled-components';
import { light, dark, ThemeName, ITheme } from 'theme';

interface IThemeContext {
  theme?: ThemeName | ITheme;
}

export const ThemeProvider: React.FC<IThemeContext> = (props) => {
  const { theme } = props;
  const themeName = theme || getThemeName();
  if (typeof themeName !== 'string') {
    return <Provider theme={themeName} >{props.children}</Provider>;
  }
  const themeColor = themeName.includes(ThemeName.Dark) ? dark : light;
  return <Provider theme={themeColor} >{props.children}</Provider>;
};

export const ThemeContext = Context as IThemeContext;
