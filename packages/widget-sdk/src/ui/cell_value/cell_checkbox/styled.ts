import styled, { css } from 'styled-components';

export const CheckboxWrapperStyled = styled.div`
  display: inline-flex;
`;

export const CheckboxStyled = styled.div<{ checked: boolean }>`
  display: inline-flex;
  padding: 2px;
  align-items: center;
  justify-content: center;
  ${props => {
    if (props.checked) {
      return css`
        opacity: 1;
      `;
    }
    return css`
      opacity: 0.2;
    `;
  }}
`;