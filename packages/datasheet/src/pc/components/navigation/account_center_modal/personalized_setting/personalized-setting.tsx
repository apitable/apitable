import { FC } from 'react';
import { Typography } from '@apitable/components';
import styles from './style.module.less';
import { Strings, t } from '@apitable/core';
import { LanguageSetting } from './language_setting';
import { ThemeSetting } from './theme_setting';
import { RecordVisionSetting } from './record_vision_setting';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display';

export const PersonalizedSetting: FC = () => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  return (
    <div className={styles.personalizedSetting}>
      <Typography variant="h6" className={styles.title}>
        {t(Strings.personalized_setting)}
      </Typography>
      <Typography variant="body3">{t(Strings.personalized_setting_tip)}</Typography>

      <ThemeSetting />
      <LanguageSetting />
      {!isMobile && <RecordVisionSetting />}
    </div>
  );
};
