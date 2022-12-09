import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';

export const FormItemTitle = styled.div.attrs(applyDefaultTheme) <{ error?: boolean }>`
  color: #8C8C8C;
  font-size: 12px;
  padding-bottom: 8px;
  ${(props) => {
    const theme = props.theme;
    return css`
      color: ${props.error ? theme.palette.danger : theme.palette.text.third};
    `;
  }}
`;
