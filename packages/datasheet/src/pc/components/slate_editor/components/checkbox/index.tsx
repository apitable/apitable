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

import { useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { CheckboxFilled, UncheckedOutlined } from '@apitable/icons';

import styles from './checkbox.module.less';

interface ICheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
  size?: number;
}

export const Checkbox = React.memo((props: ICheckboxProps) => {
  const colors = useThemeColors();
  const { checked: propsChecked, disabled, onChange, size = 16 } = props;
  const [checked, setChecked] = useState(propsChecked);
  const [hover, setHover] = useState(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const next = !checked;
      if (onChangeRef.current) {
        onChangeRef.current(next);
      } else {
        setChecked(!checked);
      }
    },
    [checked, disabled],
  );

  const handleMouseEnter = useCallback(() => {
    if (disabled) {
      return;
    }
    setHover(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) {
      return;
    }
    setHover(false);
  }, [disabled]);

  useEffect(() => {
    setChecked(propsChecked);
  }, [propsChecked]);

  return (
    <span
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={styles.wrap}
      data-disabled={!!disabled}
    >
      {checked ? (
        <CheckboxFilled size={size} color={disabled ? colors.fourthLevelText : colors.textBrandDefault} />
      ) : (
        <UncheckedOutlined size={size} color={disabled ? colors.fourthLevelText : hover ? colors.primaryColor : colors.black[400]} />
      )}
    </span>
  );
});
