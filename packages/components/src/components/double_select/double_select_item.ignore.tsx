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

import { StyledLabel, StyledOptionWrapper, StyledSubLabel } from 'components/double_select/styled';
import React from 'react';
import { IDoubleOptionsProps } from 'components/double_select/interface';

export const DoubleSelectItem: React.FC<React.PropsWithChildren<IDoubleOptionsProps>> = (props) => {
  const { option, currentIndex, selectedValue } = props;

  return <StyledOptionWrapper
    currentIndex={currentIndex}
    active={selectedValue === option.value}
    disabled={option.disabled}
  >
    <StyledLabel variant={'body2'} className={'label'}>
      {option.label}
    </StyledLabel>
    <StyledSubLabel variant={'body4'} className={'subLabel'}>
      {option.subLabel}
    </StyledSubLabel>

  </StyledOptionWrapper>;
};
