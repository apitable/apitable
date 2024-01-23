import { FC, forwardRef, MouseEvent, ReactNode } from 'react';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { Box, Typography, useTheme } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { stopPropagation } from '../../../../utils';

interface INewItemProps {
  height?: number;
  className?: string;
  children: ReactNode;
  itemId?: string,
  disabled: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export const StyledBox = styled(Box)<{ disabled?: boolean }>`
  border-radius: 4px;

  ${(props) =>
    props.disabled &&
    css`
      background-color: var(--bgControlsDisabled);
    `}

  ${(props) =>
    !props.disabled &&
    css`
   &:hover {
     background-color: var(--bgControlsHover);
   }
   &:active {
     background-color: var(--bgControlsActive);
 `}
`;

const DEFAULT_ADD_ITEM_HEIGHT = 84;

export const NewItem: FC<INewItemProps> = forwardRef<any, INewItemProps>(({ className, itemId,
  onClick, height, children, disabled }, ref) => {
  const theme = useTheme();

  return (
    <StyledBox
      id={itemId}
      ref={ref}
      tabIndex={-1}
      border={disabled ? `1px dashed ${theme.color.fc5}` : `1px solid ${theme.color.fc5}`}
      height={height ?? DEFAULT_ADD_ITEM_HEIGHT}
      display="flex"
      className={className}
      alignItems="center"
      justifyContent="center"
      disabled={disabled}
      marginTop={16}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
        stopPropagation(e);
      }}
      backgroundColor={`${theme.color.bgCommonHigh}`}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <AddOutlined color={disabled ? theme.color.textCommonDisabled : theme.color.textCommonTertiary} />
        <Typography variant="body3" color={disabled ? theme.color.textCommonDisabled : theme.color.textCommonTertiary} style={{ marginLeft: '8px' }}>
          {children ?? t(Strings.new_something)}
        </Typography>
      </Box>
    </StyledBox>
  );
});
