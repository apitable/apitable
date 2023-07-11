import React from 'react';
import { IFilterCheckboxProps } from './interface';
import { Emoji } from 'ui/_private/emoji';
import { ConfigConstant } from '@apitable/core';
import { FilterInputWrap } from './styled';

export const FilterCheckbox: React.FC<IFilterCheckboxProps> = props => {
  const { value, onChange, field } = props;

  return (
    <FilterInputWrap>
      <div
        style={{
          width: '16px',
          height: '16px',
          cursor: 'pointer',
          opacity: value ? '1' : '0.2'
        }}
        onClick={() => {
          onChange(!value);
        }}
      >
        <Emoji
          emoji={field.property.icon ?? ConfigConstant.DEFAULT_CHECK_ICON}
          size={ConfigConstant.CELL_EMOJI_SIZE}
        />
      </div>
    </FilterInputWrap>
  );
};
