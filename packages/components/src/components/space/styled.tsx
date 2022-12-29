import styled, { css } from 'styled-components';
import { ISpaceProps } from './interface';
import { FLEX_ALIGN } from './constant';

export const SpaceStyled = styled.div<ISpaceProps>`
  display: inline-flex;
  align-items: center;
  ${props => {
    const size = props.size;
    if (typeof size === 'number') {
      return css`
        gap: ${size}px;
      `;
    } else if (Array.isArray(size)) {
      return css`
        gap: ${size[1]}px ${size[0]}px;
      `;
    }
    return css`
      gap: 8px;
    `;
  }}
  ${props => {
    if (props.vertical) {
      return css`
        flex-direction: column;
      `;
    }
    return '';
  }}
  ${props => {
    if (props.wrap) {
      return css`
        flex-wrap: wrap;
      `;
    }
    return '';
  }}
  ${props => {
    if (props.align) {
      return css`
        align-items: ${FLEX_ALIGN[props.align]};
      `;
    }
    return '';
  }}
`;

export const SpaceItemStyled = styled.div<ISpaceProps>`
  display: flex;
  align-items: center;
`;

export const SplitStyled = styled.span<ISpaceProps>`
  ${props => {
    if (props.size) {
      return css`
        margin-right: ${props.size}px;
      `;
    }
    return `
      margin-right: 8px;
    `;
  }}
  height: 0.9em;
  border-left: 1px solid #E5E9ED;
`;

