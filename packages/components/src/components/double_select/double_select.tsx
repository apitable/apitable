import React, { useState } from 'react';
import { Select } from 'components/select';
import { StyledDropdownContainer } from 'components/double_select/styled';
import { IDoubleSelectProps } from 'components/double_select/interface';
import { DoubleSelectItem } from 'components/double_select/double_select_item.ignore';
import { WrapperTooltip } from 'components/tooltip';

export const DoubleSelect: React.FC<IDoubleSelectProps> = (props) => {
  const { onSelected, disabled, options, value, triggerStyle, triggerCls } = props;
  const [selectedValue, setSelectedValue] = useState(value);

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
      <StyledDropdownContainer>
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
