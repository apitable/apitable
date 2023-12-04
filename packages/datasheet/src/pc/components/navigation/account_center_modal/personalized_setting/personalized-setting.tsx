/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { FC } from 'react';
import { Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks/use_responsive';
import { LanguageSetting } from './language_setting';
import { RecordVisionSetting } from './record_vision_setting';
import { ThemeSetting } from './theme_setting';
import { TimezoneSetting } from './timezone_setting';
import styles from './style.module.less';

export const PersonalizedSetting: FC<React.PropsWithChildren<unknown>> = () => {
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
      <TimezoneSetting />
      {!isMobile && <RecordVisionSetting />}
    </div>
  );
};
