import Color from 'color';
import { rgba2hex } from 'helper';
import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { IIconButtonWrapperProps } from './interface';

export const sizeMap = {
  small: {
    size: 24,
    borderRadius: 4,
  },
  large: {
    size: 32,
    borderRadius: 6,
  }
};

export const IconButtonStyle = styled.div.attrs(applyDefaultTheme) <IIconButtonWrapperProps>`
  cursor: pointer;
  padding: 4px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  svg {
    pointer-events: none;
  }
  &[type="button"] {
    border: 0;
    &[disabled] {
      cursor: not-allowed;
      opacity: .5;
    }
  }
  ${(props) => {
    // disabled
    if (props.disabled) {
      return css`
        cursor: not-allowed;
        opacity: .5;
      `;
    }
    return '';
  }}
  ${(props) => {
    const size = props.size || 'small';
    const isSquare = props.shape === 'square';
    const _size = sizeMap[size];
    return css`
      width: ${_size.size}px;
      height: ${_size.size}px;
      border-radius: ${isSquare ? _size.borderRadius + 'px' : '50%'};
    `;
  }}
  ${(props) => {
    const { palette } = props.theme;
    const isSquare = props.shape === 'square';
    switch (props.variant) {
      case 'default':
        let defaultVariant = css`
            color: ${props.active ? palette.primary : palette.text.third};
            background: ${props.active ? palette.background.activeItem : 'unset'};
          `;
        if (!props.active && !props.disabled) {
          defaultVariant = [
            ...defaultVariant,
            css`
              &:hover {
                background: ${palette.background.iconButton};
              }
              &:active {
                background: ${rgba2hex(Color(palette.background.mask).alpha(0.16).string(), palette.background.iconButton)};
              }
            `
          ];
        }
        return defaultVariant;

      case 'background':
        let bgVariant = css`
           border-radius: ${isSquare ? '6px' : '32px'};
           color: ${palette.text.third};
           background: ${palette.background.iconButton};
        `;
        if (!props.disabled) {
          bgVariant = [
            ...bgVariant,
            css`
              &:hover {
                background: ${props.disabled ? 'inherit' :
    rgba2hex(Color(palette.background.mask).alpha(0.16).string(), palette.background.iconButton)};
              }
              &:active {
                background: ${props.disabled ? 'inherit' :
    rgba2hex(Color(palette.background.mask).alpha(0.30).string(), palette.background.iconButton)};
              }
            `
          ];
        }
        return bgVariant;
      case 'blur':
        let blurVariant = css`
          border-radius: ${isSquare ? '6px' : '32px'};
          color: ${palette.text.third};
          background: ${palette.background.iconButton};
          @supports (backdrop-filter: blur(16px)) {
            backdrop-filter: blur(3px);
            opacity: 0.7;
          }
        `;
        if (!props.disabled) {
          blurVariant = [
            ...blurVariant,
            css`
              &:hover {
                background: ${palette.background.iconButton};
                opacity: 1;
              }
              &:active {
                transform: scale(0.5, 0.5);    
                background: ${rgba2hex(Color(palette.background.mask).alpha(0.16).string(), palette.background.iconButton)};
              }
            `
          ];
        }
        return blurVariant;
    }
    return;
  }}
`;
