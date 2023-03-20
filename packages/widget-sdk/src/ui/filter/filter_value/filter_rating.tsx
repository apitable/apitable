import { Tooltip } from '@apitable/components';
import { ConfigConstant } from '@apitable/core';
import React, { useState } from 'react';
import { Emoji } from 'ui/_private/emoji';
import { IFilterRatingProps } from './interface';
import { FilterInputWrap } from './styled';

const opacityMap = {
  unChecked: 0.2,
  checked: 1,
  willChecked: 0.6
};

export const FilterRating: React.FC<IFilterRatingProps> = (props) => {
  const { field, value, onChange } = props;
  const [hoverIndex, setHoverIndex] = useState<number>();
  const _value = value?.[0];
  const { icon, max } = field.property;
  const handleClick = (index: number) => {
    if (_value === index.toString()) {
      onChange(null);
      return;
    }
    onChange([index.toString()]);
  };
  return (
    <FilterInputWrap
      onMouseOut={() => setHoverIndex(-1)}
    >
      {
        [...Array(max ?? 1)].map((_v, i) => {
          const numValue = Number(_value);
          const iValue = i + 1;
          let opacity = 0;
          if (iValue <= numValue) {
            opacity = opacityMap.checked;
          } else if (hoverIndex && hoverIndex >= iValue) {
            opacity = opacityMap.willChecked;
          } else {
            opacity = opacityMap.unChecked;
          }
          return (
            <Tooltip key={i} content={iValue.toString()} placement="top">
              <span
                style={{ opacity, cursor: 'pointer', padding: '0 2px' }}
                onMouseOver={() => setHoverIndex(iValue)}
                onMouseDown={() => handleClick(iValue)}
              >
                <Emoji emoji={icon} size={ConfigConstant.CELL_EMOJI_SIZE} />
              </span>
            </Tooltip>
          );
        })
      }
    </FilterInputWrap>
  );
};