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

import React, { useState, useEffect } from 'react';
import { Select } from 'components/select';
import { StyledDropdownContainer } from 'components/double_select/styled';
import { IDoubleSelectProps } from 'components/double_select/interface';
import { DoubleSelectItem } from 'components/double_select/double_select_item.ignore';
import { WrapperTooltip } from 'components/tooltip';

export const DoubleSelect: React.FC<React.PropsWithChildren<IDoubleSelectProps>> = (props) => {
  const { onSelected, disabled, options, value, triggerStyle, triggerCls } = props;
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const renderValue = () => {
    const option = options.find(option => option.value === selectedValue);
    return option ? option.label : '';
  };

  return <Select
    triggerStyle={triggerStyle}
    triggerCls={triggerCls}
    value={selectedValue}
    options={options}
    dropdownMatchSelectWidth={false}
    renderValue={renderValue}
    disabled={disabled}
    dropdownRender={
      <StyledDropdownContainer className={triggerCls}>
        {
          options.map((option, index) => {
            return <WrapperTooltip
              wrapper={Boolean(option.disabled && option.disabledTip)}
              tip={option.disabledTip || ''}
              key={option.value}
            >
              <div
                onClick={() => {
                  if (option.disabled) {
                    return;
                  }
                  setSelectedValue(option.value);
                  onSelected && onSelected(option, index);
                }}
              >
                <DoubleSelectItem
                  currentIndex={index}
                  option={option}
                  selectedValue={selectedValue}
                />
              </div>
            </WrapperTooltip>;
          })
        }
      </StyledDropdownContainer>
    }
  />;
};
