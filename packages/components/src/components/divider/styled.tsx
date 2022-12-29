import { fontVariants } from 'index';
import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { IDividerStyledType } from './interface';

export const DividerStyled = styled.div.attrs(applyDefaultTheme)<IDividerStyledType>`
  border: none;
  list-style: none;
  background-color: transparent;
  font-size: 16px;
  box-sizing: border-box;
  display: flex;
  ${props => fontVariants[props.typography || 'body2']}

  ${props => {
    const borderBg = props.theme.color.lineColor;
    const strokeStyle = props.dashed ? 'dashed' : 'solid';

    if (props.hasChildren) {
      return css`
        &::before, &::after {
          position: relative;
          border-top: 1px ${strokeStyle} ${borderBg};
          top: 50%;
          content: "";
          transform: translateY(50%);
        }
        &::before {
          width: ${props.textAlign === 'left' ? 0 : '100%'}
        }
        &::after {
          width: ${props.textAlign === 'right' ? 0 : '100%'}
        }
        & > div {
          padding-left: ${props.textAlign === 'left' ? 0 : undefined};
          padding-right: ${props.textAlign === 'right' ? 0 : undefined};
        }
      `;
    }

    if (props.orientation === 'vertical') {
      return css`
        width: 0px;
        height: .9em;
        border-right: 1px ${strokeStyle} ${borderBg};
        display: inline-block;
        margin: 0 16px;
        position: relative;
        top: 0.05em;
      `;
    }

    return css`
      width: 100%;
      height: 0px;
      border-top: 1px ${strokeStyle} ${borderBg};
    `;
  }}
`;

export const DividerChildStyled = styled.div`
  display: inline-block;
  padding: 0 1em;
  white-space: nowrap;
`;