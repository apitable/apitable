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
import { RadioSpanStyled, RadioInputStyled, RadioInnerStyled, RadioLabelStyled, RadioTextStyled } from './styled';
import cls from 'classnames';
import { RadioGroupContext } from './context';
import { IRadio } from './interface';

export const Radio = React.forwardRef(({
  children,
  name,
  checked,
  onChange,
  readOnly,
  value,
  ...restProps
}: IRadio, ref: React.Ref<HTMLLabelElement>) => {
  const context = React.useContext(RadioGroupContext);
  const handleChange = (e: React.ChangeEvent) => {
    onChange?.(e);
    context?.onChange?.(e);
  };
  const disabled = restProps.disabled || context?.disabled;
  const isChecked = context.value === value;
  const isBtn = restProps.isBtn || context?.isBtn;
  const inputProps = {
    name: name || context.name,
    checked: checked || (context.value ? isChecked : undefined),
    disabled,
    onChange: handleChange,
    readOnly,
    value
  };
  return (
    <RadioLabelStyled ref={ref} className={cls({
      'radio-label-btn': isBtn,
      'radio-label-btn-checked': isBtn && isChecked,
      'radio-label-btn-disabled': isBtn && disabled,
    })}>
      <RadioSpanStyled className={cls({
        'radio-btn': isBtn,
        'radio-checked': isChecked,
        'radio-disabled': disabled,
      })}>
        <RadioInputStyled type="radio" {...inputProps} />
        {!isBtn && <RadioInnerStyled className="radio-inner"/>}
      </RadioSpanStyled>
      <RadioTextStyled className="radio-text">
        {children}
      </RadioTextStyled>
    </RadioLabelStyled>
  );
});