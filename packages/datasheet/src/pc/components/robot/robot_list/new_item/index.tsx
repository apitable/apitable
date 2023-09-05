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
    disabled: boolean;
    onClick ?: (event: MouseEvent<HTMLElement>) => void;
}

export const StyledBox = styled(Box)<{disabled?: boolean}>`
  border-radius: 4px;
 ${props => !props.disabled && css`
   &:hover {
     background-color: var(--bgControlsHover);

     border-color: var(--borderBrandActive);
   }
 `}
`;

const DEFAULT_ADD_ITEM_HEIGHT = 84;

export const NewItem: FC<INewItemProps> = forwardRef<any, INewItemProps>(({ className, onClick, height, children, disabled }, ref) => {

  const theme = useTheme();
  
  return (
    <StyledBox
      ref={ref}
      tabIndex={-1}
      border={disabled? `1px dashed ${theme.color.fc5}`: `1px solid ${theme.color.fc5}`}
      height={ height ?? DEFAULT_ADD_ITEM_HEIGHT }
      display="flex"
      className={className}
      alignItems="center"
      justifyContent="center"
      marginTop={16}
      onClick={(e) => {
        if(disabled) return;
        onClick?.(e);
      }}
      backgroundColor={`${theme.color.fc8}`}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={stopPropagation}
      >
        <AddOutlined color={theme.color.fc1} />
        <Typography variant="body3" color={theme.color.textCommonTertiary} style={{ marginLeft: '4px' }}>
          {children ?? t(Strings.new_something)}
        </Typography>

      </Box>
    </StyledBox>
  );

});