import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { IRadioGroup } from './interface';

export const RadioGroupStyled = styled.div.attrs(applyDefaultTheme) <IRadioGroup>`
  display: flex;
  label {
    ${props => {
    if (props.block) {
      return css`
          flex: 1;
        `;
    }
    return '';
  }}
    .radio-text {
      ${props => {
    if (props.block && props.isBtn) {
      return css`
            font-size: 13px;
            margin: 0 auto;
          `;
    }
    return '';
  }}
    }
  }
  ${props => {
    if (props.isBtn) {
      const { background } = props.theme.palette;
      return css`
        display: ${props.block ? 'flex' : 'inline-flex'};
        flex-flow: row wrap;
        padding: 4px;
        background-color: ${background.input};
      `;
    }
    if (props.row) {
      return css`
        flex-flow: row wrap;
      `;
    }
    return css`
      flex-flow: column wrap;
    `;
  }}
  ${props => {
    if (props.isBtn) {
      return `
        border-radius: 4px;
      `;
    }
    return '';
  }}
`;