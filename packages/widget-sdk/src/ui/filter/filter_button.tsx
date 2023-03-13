import { LinkButton, useThemeColors } from '@apitable/components';
import { AddOutlined } from '@apitable/icons';
import React from 'react';

interface IFilterButtonProps {
  onClick?: () => void;
  children?: any;
}

export const FilterButton = (props: IFilterButtonProps) => {
  const { onClick, children } = props;

  const colors = useThemeColors();
  return (
    <LinkButton
      prefixIcon={<AddOutlined />}
      href={'javascript:void(0)'}
      underline={false}
      color={colors.secondLevelText}
      onClick={onClick}
    >
      {children}
    </LinkButton>
  );
};