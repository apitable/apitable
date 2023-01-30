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

import React from 'react';
import { RadioGroupContext } from '../context';
import { IRadioGroup } from './interface';
import { RadioGroupStyled } from './styled';
import { Radio } from '../radio';

export const RadioGroup = React.forwardRef(({
  children,
  name,
  disabled,
  onChange,
  options,
  ...restProps
}: IRadioGroup) => {
  const [value, setValue] = React.useState(() => restProps.value);
  const handleChange = (event: React.ChangeEvent<any>) => {
    const targetValue = event.target.value;
    setValue(targetValue);
    if (onChange) {
      onChange(event, targetValue);
    }
  };
  return (
    <RadioGroupContext.Provider value={{ name, disabled, onChange: handleChange, value, isBtn: restProps.isBtn }}>
      <RadioGroupStyled {...restProps}>
        {options ? options.map((option, idx) => {
          const { label, ...restOption } = option;
          return (
            <Radio key={idx} {...restOption}>{label}</Radio>
          );
        }) : children}
      </RadioGroupStyled>
    </RadioGroupContext.Provider>
  );
});