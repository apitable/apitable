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

import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';

interface ITextButtonBaseProps {
  size?: 'x-small' | 'small' | 'middle' | 'large';
  btnColor?: 'default' | 'danger' | 'primary';
  disabled?: boolean;
  block?: boolean;
}

export const TextButtonBase = styled.button.attrs(applyDefaultTheme) <ITextButtonBaseProps>`
  cursor: pointer;
  transition: background-color 100ms linear;
  border: none;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${(props) => {
    const sizeAttrMap = {
      'x-small': {
        height: 22,
        padding: '0 16px',
        borderRadius: 4,
        fontSize: 12,
      },
      small: {
        height: 32,
        padding: '7px 16px',
        borderRadius: 4,
        fontSize: 12,
      },
      middle: {
        height: 40,
        padding: '9px 16px',
        borderRadius: 6,
        fontSize: 14,
      },
      large: {
        height: 48,
        padding: '13px 16px',
        borderRadius: 8,
        fontSize: 14,
      }
    };
    const attr = sizeAttrMap[props.size || 'middle'];
    return css`
      border-radius: ${attr.borderRadius}px;
      padding: ${attr.padding};
      height: ${attr.height}px;
      font-size: ${attr.fontSize}px;
    `;
  }}
  &:focus {
    box-shadow: none;
    outline: none;
  };
  &:active {
    box-shadow: none;
    outline: none;
  };
  ${(props) => {
    if (props.block) return css`width:100%;`;
    return;
  }}
  ${(props) => {
    if (props.disabled) {
      return css`
        cursor: not-allowed;
        opacity: 0.5;
      `;
    }
    return;
  }};
  ${(props) => {
    const { 
      bgBglessHover, 
      bgBglessActive, 
      textCommonPrimary, 
      bgBrandLightDefault, 
      bgBrandLightHover,
      textBrandDefault,
      bgDangerLightDefault,
      bgDangerLightHover,
      textDangerDefault,
    } = props.theme.color;
    const colorMap = {
      default: {
        normal: textCommonPrimary,
        hover: textCommonPrimary,
        press: textCommonPrimary,
      },
      primary: {
        normal: textBrandDefault,
        hover: textBrandDefault,
        press: textBrandDefault,
      },
      danger: {
        normal: textDangerDefault,
        hover: textDangerDefault,
        press: textDangerDefault,
      },
    };
    const backgroundMap = {
      default: {
        hover: bgBglessHover,
        press: bgBglessActive,
      },
      primary: {
        hover: bgBrandLightDefault,
        press: bgBrandLightHover,
      },
      danger: {
        hover: bgDangerLightDefault,
        press: bgDangerLightHover,
      },
    };
    const btnColor = props.btnColor || 'default';
    if (props.disabled) {
      return css`
        color: ${colorMap[btnColor].normal};
        background: none;
      `;
    }
    return css`
      color: ${colorMap[btnColor].normal};
      background: none;
      &:hover {
        color: ${colorMap[btnColor].hover};
        background: ${backgroundMap[btnColor].hover};
      }
      &:active {
        color: ${colorMap[btnColor].hover};
        background: ${backgroundMap[btnColor].press};
      }
    `;
  }}
`;

export const IconSpanStyled = styled.span<{ existIcon: boolean; position: string }>`
  display: flex;
  justify-content: center;
  
  ${props => {
    if (!props.existIcon) {
      return;
    }
    if (props.position === 'suffix') {
      return css`
        margin-left:4px;
        `;
    }
    return css`
    margin-right:4px;
    `;
  }};
`;
