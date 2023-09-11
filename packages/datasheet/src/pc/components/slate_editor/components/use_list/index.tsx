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

import { useContext } from 'react';
import { EditorContext } from '../../context';
import { hotkeyMap } from '../../hotkeys/map';
import Icons from '../icons';

import styles from './style.module.less';

export const useListWithIcons = (list: Array<string>) => {
  const { i18nText } = useContext(EditorContext);
  return list.map((item) => {
    const key = item;
    const label = i18nText[key] ?? key;
    const Icon = Icons[key];
    return {
      value: key,
      label,
      option: (
        <span className={styles.iconAndLabel}>
          <span className={styles.iconWrap}>
            <Icon />
          </span>
          {label}
        </span>
      ),
    };
  });
};

export const useListWithIconAndHotkey = (list: Array<string>) => {
  const { i18nText } = useContext(EditorContext);
  return list.map((item) => {
    const key = item;
    const label = i18nText[key] ?? key;
    const Icon = Icons[key];
    return {
      value: key,
      label,
      option: (
        <span className={styles.iconAndHotkeyWrap}>
          <span className={styles.iconAndLabel}>
            <span className={styles.iconWrap}>
              <Icon />
            </span>
            {label}
          </span>
          <span className={styles.hotkey}>{hotkeyMap[key] && hotkeyMap[key].platform}</span>
        </span>
      ),
    };
  });
};
