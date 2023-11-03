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

import { Tooltip } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { FC, useState } from 'react';
import { useThemeColors } from '@apitable/components';
import { ISelectFieldOption, Selectors, Strings, t } from '@apitable/core';
import { setColor } from 'pc/components/multi_grid/format';
import { stopPropagation } from 'pc/utils';
import { OptionSetting } from './enum';
import styles from './style.module.less';

import {useAppSelector} from "pc/store/react-redux";

export interface IColorGroupProps {
  colorGroup: number[];
  option: ISelectFieldOption;
  onChange?: (type: OptionSetting, id: string, value: string | number) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export const ColorGroup: FC<React.PropsWithChildren<IColorGroupProps>> = (props) => {
  const { colorGroup, option, onChange, style, disabled } = props;
  const [colorIdx, setColorIdx] = useState<number>();
  const colors = useThemeColors();
  const cacheTheme = useAppSelector(Selectors.getTheme);

  return (
    <ul className={styles.colorGroup} style={style}>
      {colorGroup.map((colorIndex) => {
        const selected = colorIndex === option.color;
        const li = (
          <li className={styles.item} key={option.id + colorIndex}>
            <div
              className={classNames(styles.outer, {
                [styles.disabled]: disabled,
                [styles.colorSelected]: selected,
                [styles.active]: selected && colorIdx,
              })}
              onClick={(e: React.MouseEvent) => {
                stopPropagation(e);
                onChange?.(OptionSetting.SETCOLOR, option.id, colorIndex);
                setColorIdx(colorIndex);
              }}
              onMouseDown={stopPropagation}
              key={colorIndex}
            >
              <div className={styles.borderWhite}>
                <div
                  className={styles.inner}
                  style={{
                    background: colorIndex === -1 ? colors.defaultBg : setColor(colorIndex, cacheTheme),
                    border: colorIndex === -1 ? `1px solid ${colors.textCommonTertiary}` : 'none',
                  }}
                />
              </div>
            </div>
          </li>
        );
        return disabled ? <Tooltip title={t(Strings.view_lock_setting_desc)}>{li}</Tooltip> : <>{li}</>;
      })}
    </ul>
  );
};
