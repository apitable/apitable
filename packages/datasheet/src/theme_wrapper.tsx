import { ThemeName, ThemeProvider } from '@vikadata/components';
import { Selectors, StoreActions } from '@apitable/core';
import { useKeyPress, useLocalStorageState } from 'ahooks';
import { SystemTheme } from 'pc/common/theme';
import { getEnvVariables } from 'pc/utils/env';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ThemeWrapper: React.FC = (props) => {
  const [theme, setTheme] = useLocalStorageState<ThemeName>('theme', { defaultValue: getEnvVariables().THEME || ThemeName.Light });
  const [systemTheme, setSystemTheme] = useLocalStorageState<SystemTheme>('systemTheme', { defaultValue: SystemTheme.Close });
  const dispatch = useDispatch();
  const cacheTheme = useSelector(Selectors.getTheme);

  useEffect(() => {
    const curTheme = theme || ThemeName.Light;
    const html = document.querySelector('html');
    html?.setAttribute('data-theme', curTheme);
    dispatch(StoreActions.setTheme(curTheme));
  }, [dispatch, theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSystemTheme = (localStorage.getItem('systemTheme'));
      if (newSystemTheme && JSON.parse(newSystemTheme) !== systemTheme) {
        setSystemTheme(systemTheme === SystemTheme.Close ? SystemTheme.Open : SystemTheme.Close);
      }
    }, 5 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [setSystemTheme, systemTheme]);

  useEffect(() => {
    if (!systemTheme || systemTheme === SystemTheme.Close) return;
    const themeMedia = window.matchMedia('(prefers-color-scheme: light)');
    // systemTheme 状态变化为 open 时，重置 theme
    setTheme(themeMedia.matches ? ThemeName.Light : ThemeName.Dark);
    const listener = e => {
      if (e.matches) {
        setTheme(ThemeName.Light);
      } else {
        setTheme(ThemeName.Dark);
      }
    };
    themeMedia.addEventListener('change', listener);
    return () => {
      themeMedia.removeEventListener('change', listener);
    };
  }, [setTheme, systemTheme]);

  useKeyPress(['shift.meta.l'], () => {
    theme === ThemeName.Light ? setTheme(ThemeName.Dark) : setTheme(ThemeName.Light);
  });

  return <ThemeProvider theme={cacheTheme}>
    {props.children}
  </ThemeProvider>;
};

export default ThemeWrapper;
