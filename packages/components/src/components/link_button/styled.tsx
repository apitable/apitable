import { getActionColor } from 'helper/color_helper';
import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { ILinkButtonProps } from './interface';

export const LinkButtonText = styled.span<Pick<ILinkButtonProps, 'underline' | 'prefixIcon' | 'suffixIcon' | 'block'>>`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  ${props => Boolean(props.underline) && css`
    border-bottom: 1px solid currentColor;
  `}
  ${props => {
    if (props.prefixIcon) {
      return css`
        margin-left: 4px;
      `;
    }
    if (props.suffixIcon) {
      return css`
        margin-right: 4px;
      `;
    }
    return '';
  }}
`;
type ILinkButtonBaseProps = Omit<ILinkButtonProps, 'color' | 'as'>;

export const StyledLinkButton = styled.div.attrs(applyDefaultTheme) <ILinkButtonBaseProps>`
  ${(props) => {
    if (props.block) return css`width:100%;`;
    return css `width: max-content;`;
  }}
  ${(props) => {
    if (props.disabled) {
      return css`
          cursor: not-allowed;
          opacity: 0.5;
          pointer-events: none;
        `;
    }
    return;
  }};
  ${(props) => {
    const { deepPurple } = props.theme.color;
    const color = props.color || deepPurple[500];
    let { hover, active } = getActionColor(color);
    if (props.disabled) {
      hover = color;
      active = color;
    }
    return css`
      color: ${color};
      &:hover {
        color: ${hover};
      }
      &:active {
        color: ${active};
      }  
    `;
  }}
  &[type="button"] {
    background-color: transparent;
    padding: 9px 16px;
    border: 0;
  }

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-decoration-line: none;
`;