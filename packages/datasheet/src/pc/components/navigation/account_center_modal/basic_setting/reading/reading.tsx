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

import parser from 'html-react-parser';
import Image from 'next/image';
import { FC } from 'react';
import { Typography, useThemeColors } from '@apitable/components';
import { Strings, t, ThemeName } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import InfoStateDark from 'static/icon/common/info_state_dark.png';
import InfoStateLight from 'static/icon/common/info_state_light.png';
import styles from './styles.module.less';

interface IReadingProps {
  [key: string]: any;
}

const size = 160;

export const Reading: FC<React.PropsWithChildren<IReadingProps>> = () => {
  const colors = useThemeColors();
  const theme = useAppSelector((state) => state.theme);
  const InfoState = theme === ThemeName.Light ? InfoStateLight : InfoStateDark;

  return (
    <div className={styles.content}>
      <div className={styles.top}>
        <Image src={InfoState} width={size} height={size} alt="Info" />
      </div>

      <Typography
        variant="h6"
        style={{
          textAlign: 'center',
        }}
      >
        {t(Strings.log_out_reading_h6)}
      </Typography>
      <div className={styles.detail}>
        <Typography
          variant="h8"
          style={{
            margin: '8px 0',
          }}
        >
          {t(Strings.log_out_reading_h8)}
        </Typography>
        <Typography variant="body2" color={colors.fc2}>
          {parser(t(Strings.log_out_user_list))}
        </Typography>
      </div>
    </div>
  );
};
