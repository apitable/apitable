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
import { ISwitchProps } from './interface';

const duration = '.3s';

export const SIZE_MAP = {
  small: {
    height: 16,
    width: 28,
    innerSize: 12,
  },
  default: {
    height: 20,
    width: 36,
    innerSize: 16,
  },
  large: {
    height: 28,
    width: 48,
    innerSize: 20,
  },

  xl: {
    height: 48,
    width: 116,
    innerSize: 40,
  }
};

export const SwitchBase = styled.button.attrs(applyDefaultTheme) <ISwitchProps>`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  padding: 0;
  border: none;
  vertical-align: middle;
  border-radius: 20px 20px;
  transition: all 0.3s;
  ${props => css`background-color: ${props.theme.color.defaultTag};`}
  cursor: pointer;


  &:focus {
    outline: none;
  }
  ${props => props.disabled && css`
    cursor: not-allowed;
    opacity: 0.4;
  `}
  ${props => props.checked && css`
    background: ${props.theme.color.deepPurple[500]};
  `}
  ${(props) => {
    const propsSize = props.size || 'default';
    const sizeMap = SIZE_MAP[propsSize];
    return css`
      height: ${sizeMap.height}px;
      min-width: ${sizeMap.width}px;
    `;
  }}
`;
export const SwitchInnerBase = styled.span <ISwitchProps>`
  color:#fff;
  font-size: 12px;
  position: absolute;
  left: 24px;
  top: 0;
  ${props => props.checked && css`
    left: 6px;
  `}
  ${props => props.disabled && css`
    left: 6px;
    cursor: ${props.disabled ? 'not-allowed' : 'pointer'};
  `}
`;
export const SwitchBeforeBase = styled.span.attrs(applyDefaultTheme) <ISwitchProps>`
  display: inline-block;
  position: absolute;
  content: " ";
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
  transition: left ${duration} cubic-bezier(0.35, 0, 0.25, 1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => {
    const propsSize = props.size || 'default';
    const { innerSize, height, width } = SIZE_MAP[propsSize];
    const innerSpace = (height - innerSize) / 2;
    const fontSize = `calc(${innerSize}px - 4px);`;
    const { bgStaticLightDefault } = props.theme.color;
    return css`
      background-color: ${bgStaticLightDefault};
      width: ${innerSize}px;
      height: ${innerSize}px;
      border-radius: ${innerSize / 2}px;
      top:  ${innerSpace}px;
      left: ${props.checked ? width - innerSize - innerSpace : innerSpace}px;
      transition: all 0.3s ease-in-out;
      font-size: ${fontSize};
    `;
  }}
`;
