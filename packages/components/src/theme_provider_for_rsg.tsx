import React from 'react';
import { ThemeProvider } from './theme_provider';
import { useLocalStorageState } from 'ahooks';
import { light, dark } from 'theme';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [isDarkMode] = useLocalStorageState('isDarkMode', { defaultValue: false });

  return <ThemeProvider theme={isDarkMode ? dark : light}>
    {children}
  </ThemeProvider>;
}
