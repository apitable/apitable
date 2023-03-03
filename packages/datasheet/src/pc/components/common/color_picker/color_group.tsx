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

import { useThemeColors } from '@apitable/components';
import { ISelectFieldOption, Selectors } from '@apitable/core';
import classNames from 'classnames';
import { setColor } from 'pc/components/multi_grid/format';
import { rgbaToHex, stopPropagation } from 'pc/utils';
import { FC, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { OptionSetting } from './enum';
import styles from './style.module.less';

export interface IColorGroupProps {
  colorGroup: number[];
  option: ISelectFieldOption;
  onChange?: (type: OptionSetting, id: string, value: string | number) => void;
  style?: React.CSSProperties;
}

export const ColorGroup: FC<React.PropsWithChildren<IColorGroupProps>> = props => {
  const { colorGroup, option, onChange, style } = props;
  const [colorIdx, setColorIdx] = useState<number>();
  const colors = useThemeColors();
  const cacheTheme = useSelector(Selectors.getTheme);

  return (
    <ul className={styles.colorGroup} style={style}>
      {colorGroup.map(colorIndex => {
        const selected = colorIndex === option.color;
        return (
          <li className={styles.item} key={option.id + colorIndex}>
            <div
              className={classNames(styles.outer, {
                [styles.colorSelected]: selected,
                [styles.active]: selected && colorIdx,
              })}
              onClick={(e: React.MouseEvent) => {
                stopPropagation(e);
                onChange?.(OptionSetting.SETCOLOR, option.id, colorIndex);
                setColorIdx(colorIndex);
              }}
              onMouseDown={stopPropagation}
            >
              <div className={styles.borderWhite}>
                <div
                  className={styles.inner}
                  style={{
                    background: colorIndex === -1 ? colors.defaultBg : setColor(colorIndex, cacheTheme),
                    border: colorIndex === -1 ? `1px solid ${rgbaToHex(colors.fourthLevelText, 0.8)}` : 'none',
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
