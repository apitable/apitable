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

import { CheckOutlined } from '@apitable/icons';
import { useKeyPress } from 'ahooks';
import React, { useRef, useState, useEffect } from 'react';
import { CheckboxIconWrapper, CheckboxWrapper } from './styled';
import { ICheckboxProps } from './interface';
import { useProviderTheme } from 'hooks';

export const Checkbox: React.FC<React.PropsWithChildren<ICheckboxProps>> = props => {
  const { size = 16, onChange, color, disabled, checked: _checked, children } = props;
  const isCheckedBoolean = typeof _checked === 'boolean';
  const checkboxRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState(Boolean(_checked));
  const theme = useProviderTheme();
  const { blackBlue } = theme.color;
  const handleClick = () => {
    if (!disabled) {
      !isCheckedBoolean && setChecked(!checked);
      onChange && onChange(!checked);
    }
  };
  useEffect(() => {
    if (isCheckedBoolean) {
      setChecked(_checked);
    }
  }, [_checked, isCheckedBoolean]);
  useKeyPress(
    'Space',
    (e: Event) => {
      handleClick();
      e.preventDefault();
    },
    { target: checkboxRef }
  );

  return (
    <CheckboxWrapper
      onClick={handleClick}
      aria-checked={checked}
      disabled={disabled}
      checked={checked}
      color={color}
    >
      <CheckboxIconWrapper
        size={size}
        checked={checked}
        color={color}
        tabIndex={0}
        role="checkbox"
        ref={checkboxRef}
        disabled={disabled}
      >
        {
          checked && <CheckOutlined size={size * 0.75} color={blackBlue[50]} />
        }
      </CheckboxIconWrapper>
      {children && <span style={{ paddingLeft: 4 }}>{children}</span>}
    </CheckboxWrapper>
  );
};
