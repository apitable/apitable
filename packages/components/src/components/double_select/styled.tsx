import styled, { css } from 'styled-components';
import { ListDeprecate } from '../list_deprecate';
import { Typography } from 'components/typography';
import { applyDefaultTheme } from 'theme';

export const StyledOptionWrapper = styled(ListDeprecate.Item).attrs(applyDefaultTheme)<{ active: boolean; disabled?: boolean }>`
  margin: 0 8px;
  padding: 8px;
  height: auto;
  display: flex;
  align-items: flex-start;
  flex-flow: column;
  justify-content: center;
  cursor: pointer;

  ${props => {
    if (props.disabled) {
      return css`
        cursor: not-allowed;
        opacity: 0.5;
      `;
    }
    return;
  }}
  .label {
    ${(props) => {
    const { deepPurple } = props.theme.color;
    if (props.active) {
      return css`
          color: ${deepPurple[500]};
        `;
    }
    return;
  }}
  }


`;

export const StyledDropdownContainer = styled.div`
  color: ${props => {
    return `
      background: ${props.theme.color.defaultBg};
    `;
  }};
`;

export const StyledLabel = styled(Typography)`
  width: 100%;
`;

export const StyledSubLabel = styled(Typography).attrs(applyDefaultTheme)`
  width: 100%;
  color: ${props => {
    return props.theme.color.black[500];
  }};
`;
