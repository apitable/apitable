import styled, { css } from 'styled-components';

export const RatingStyled = styled.div`
  display: inline-flex;
`;

export const RatingItemStyled = styled.span<{ checked: boolean }>`
  padding: 0 2px;
  opacity: 0.2;
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