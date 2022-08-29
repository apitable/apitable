import { ThemeName, ThemeProvider } from '@vikadata/components';
import { useEffect, useState } from 'react';
import { getTheme, switchTheme } from './theme';

export const ThemeWrap = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>(getTheme());
  useEffect(() => {
    const messageListener = (event) => {
      const { data } = event;
      if (data?.type === 'vika_theme') {
        switchTheme(data?.vika_theme);
        setTheme(getTheme());
      }
    };
    window.addEventListener('message', messageListener);
    return () => window.removeEventListener('message', messageListener);
  });
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
