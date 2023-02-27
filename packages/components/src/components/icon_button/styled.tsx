/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
    const { palette, color } = props.theme;
    const isSquare = props.shape === 'square';
    switch (props.variant) {
      case 'default':
        let defaultVariant = css`
            color: ${props.active ? color.textBrandDefault : palette.text.third};
            background: ${props.active ? color.bgBrandLightDefault : 'unset'};
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
