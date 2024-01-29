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

import Image from 'next/image';
import { FC } from 'react';
import { ThemeName } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import EmptyPngDark from 'static/icon/datasheet/empty_state_dark.png';
import EmptyPngLight from 'static/icon/datasheet/empty_state_light.png';
import styles from './style.module.less';

export const NoData: FC<React.PropsWithChildren<unknown>> = () => {
  const themeName = useAppSelector((state) => state.theme);
  const EmptyPng = themeName === ThemeName.Light ? EmptyPngLight : EmptyPngDark;
  return (
    <div className={styles.invalidMsg}>
      <div className={styles.img}>
        <Image src={EmptyPng} alt="empty" />
      </div>
      <div className={styles.text}>{t(Strings.no_notification)}</div>
    </div>
  );
};
