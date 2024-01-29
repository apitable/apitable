import Image from 'next/image';
import { Box, ThemeName, Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import quicksearchDark from 'static/icon/common/quicksearch_default_dark.png';
import quicksearchLight from 'static/icon/common/quicksearch_default_light.png';
import styles from './style.module.less';

export const DefaultContent = () => {
  const theme = useAppSelector((state) => state.theme);
  const defaultImg = theme === ThemeName.Light ? quicksearchLight : quicksearchDark;
  return (
    <div className={styles.defaultContent}>
      <Box padding={'12px 19px 9px'}>
        <Image src={defaultImg} alt="search" width={320} height={240} />
      </Box>
      <Typography style={{ paddingBottom: 8 }} align="center" variant={'h7'}>
        {t(Strings.quick_search_title)}
      </Typography>
      <Typography variant={'body3'}>{t(Strings.quick_search_intro)}</Typography>
    </div>
  );
};
