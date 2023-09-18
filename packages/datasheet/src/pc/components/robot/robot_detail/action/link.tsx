import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '@apitable/components';
import { StyledAdd, StyledLinkIcon } from '../../../automation/icons';

const StyledBox = styled(Box)<{
  disabled?: boolean;
}>`
  cursor: pointer;
  position: relative;
  ${StyledLinkIcon} {
    left: 0;
    top: 0;
    position: absolute;
    visibility: visible;
  }
  ${StyledAdd} {
    left: 0;
    top: 0;
    position: absolute;
    visibility: hidden;
  }

  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}

  ${(props) =>
    !props.disabled &&
    css`
      &:hover {
        ${StyledAdd} {
          visibility: visible;
        }

        ${StyledLinkIcon} {
          visibility: hidden;
        }
      }
    `}
`;

export const LinkButton: FC<{
  disabled: boolean;
}> = ({ disabled }) => {
  return (
    <Box width={'100%'} display={'flex'} justifyContent={'center'}>
      <StyledBox width={'18px'} height={'48px'} disabled={disabled}>
        <StyledLinkIcon />
        <StyledAdd />
      </StyledBox>
    </Box>
  );
};
