import { Box, ThemeName, Typography } from '@apitable/components';
import styles from './style.module.less';
import { useSelector } from 'react-redux';
import { integrateCdnHost, Settings, Strings, t } from '@apitable/core';

export const DefaultContent = () => {
  const theme = useSelector(state => state.theme);
  const defaultImg = theme === ThemeName.Light ? Settings.quick_search_default_light.value : Settings.quick_search_default_dark.value;
  return (
    <div className={styles.defaultContent}>
      <Box padding={'12px 58px 39px'}>
        <img src={integrateCdnHost(defaultImg)} alt='search' />
      </Box>
      <Typography style={{ paddingBottom: 8 }} align='center' variant={'h7'}>{t(Strings.quick_search_title)}</Typography>
      <Typography variant={'body3'} >{t(Strings.quick_search_intro)}</Typography>
    </div>
  );
};