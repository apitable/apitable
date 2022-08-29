import { FC } from 'react';
import { Select, ThemeName, Typography } from '@vikadata/components';
import { useLocalStorageState } from 'ahooks';
import styles from './style.module.less';
import { StoreActions, Strings, t, TrackEvents } from '@vikadata/core';
import { useDispatch } from 'react-redux';
import { SystemTheme } from 'pc/common/theme';
import { tracker } from 'pc/utils/tracker';
import { getEnvVariables } from 'pc/utils/env';

const options = [{
  label: t(Strings.default_theme),
  value: ThemeName.Light
}, {
  label: t(Strings.dark_theme),
  value: ThemeName.Dark
}, {
  label: t(Strings.system_theme),
  value: 'system'
}];

export const ThemeSetting: FC = () => {
  const [theme, setTheme] = useLocalStorageState<ThemeName>('theme', {
    defaultValue: getEnvVariables().THEME || ThemeName.Light
  });
  const [systemTheme, setSystemTheme] = useLocalStorageState<SystemTheme>('systemTheme', { defaultValue: SystemTheme.Close });
  const dispatch = useDispatch();

  const handleSelected = (option) => {
    let newValue: ThemeName | 'system' = option.value;
    if (newValue === (systemTheme === SystemTheme.Open ? 'system' : theme)) {
      return;
    }
    if (newValue === 'system') {
      setSystemTheme(SystemTheme.Open);
      tracker.track(TrackEvents.Theme, {
        themeType: 'FollowSystem'
      });
      const themeMedia = window.matchMedia('(prefers-color-scheme: light)');
      newValue = themeMedia.matches ? ThemeName.Light : ThemeName.Dark;
    } else {
      setSystemTheme(SystemTheme.Close);
      tracker.track(TrackEvents.Theme, {
        themeType: newValue
      });
    }
    dispatch(StoreActions.setTheme(newValue));
    setTheme(newValue);
    const html = document.querySelector('html');
    html?.setAttribute('data-theme', newValue);
  };

  return (
    <div className={styles.themeSetting}>
      <Typography variant="h7" className={styles.title}>{t(Strings.theme_setting)}</Typography>
      <Select
        options={options}
        value={systemTheme === SystemTheme.Open ? 'system' : (theme || ThemeName.Light)}
        onSelected={handleSelected}
        dropdownMatchSelectWidth
        triggerStyle={{ width: 200 }}
      />
    </div>
  );
};
