import React from 'react';
import { ISelectFieldBaseOpenValue } from '@apitable/core';
import { black } from '@vikadata/components';
import { compact, find } from 'lodash';
import { OptionItemStyled, OptionsWrapperStyled } from './styled';
import { ICellOptions, IOptionItem } from './interface';

const COLOR_INDEX_THRESHOLD = 30;

const OptionItem = (props: IOptionItem) => {
  const { text, ...rest } = props;
  return (
    <OptionItemStyled {...rest}>
      {text}
    </OptionItemStyled>
  );
};

export const CellOptions = (props: ICellOptions) => {
  const { options, selectOptions, className, style, cellClassName, cellStyle } = props;
  const renderOption = (option: ISelectFieldBaseOpenValue) => {
    const color = find(options, { id: option.id })?.color;
    const textColor = color && color >= COLOR_INDEX_THRESHOLD ? black[50] : black[1000];
    return (
      <OptionItem
        key={option.id}
        bg={option.color.value}
        text={option.name}
        textColor={textColor}
        className={cellClassName}
        style={cellStyle}
      />
    );
  };
  if (!selectOptions) {
    return null;
  }
  if (Array.isArray(selectOptions)) {
    return (
      <OptionsWrapperStyled className={className} style={style}>
        {compact(selectOptions).map(renderOption)}
      </OptionsWrapperStyled>
    );
  }
  return renderOption(selectOptions);
};

