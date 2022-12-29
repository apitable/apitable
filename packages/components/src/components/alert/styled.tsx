import Color from 'color';
import styled, { css } from 'styled-components';
import { IAlertWrapper } from './interface';
import { applyDefaultTheme } from 'theme';
import { rgba2hex } from 'helper';

export const AlertWrapper = styled.div.attrs(applyDefaultTheme) <IAlertWrapper>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.title ? '16px' : '8px 16px'};
  width: 100%;
  box-sizing: border-box;
  border-radius: 6px;
  ${props => {
    const colorMap = {
      default: props.theme.palette.primary,
      error: props.theme.palette.danger,
      warning: props.theme.palette.warning,
      success: props.theme.palette.success,
    };
    const color = colorMap[props.type];
    // const opacity = props.theme.palette.type === 'light' ? 0.1 : 0.9;
    return css`
      background: ${rgba2hex(Color(color).alpha(0.1).string(), props.theme.palette.background.primary)};
      border: 1px solid ${color};
    `;
  }}
`;

export const AlertInner = styled.div`
  /* Auto Layout */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  z-index: 1;
`;