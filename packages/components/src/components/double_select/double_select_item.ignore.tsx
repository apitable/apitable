import { StyledLabel, StyledOptionWrapper, StyledSubLabel } from 'components/double_select/styled';
import React from 'react';
import { IDoubleOptionsProps } from 'components/double_select/interface';

export const DoubleSelectItem: React.FC<IDoubleOptionsProps> = (props) => {
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
