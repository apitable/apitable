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
import { ICheckboxProps } from './interface';
import { applyDefaultTheme } from 'theme';

type ICheckboxIconProps = Omit<ICheckboxProps, 'onChange'>;

export const CheckboxIconWrapper = styled.div.attrs(applyDefaultTheme) <ICheckboxIconProps>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-grow: 0;
  cursor: pointer;
  transition: background 200ms ease-out 0s;
  border-radius: 2px;
  border: ${(props) => !props.checked ? `2px solid ${props.theme.color.black[400]}` : 'none'};
  &:hover{
    border: ${(props) => !props.checked ? `2px solid ${props.color || props.theme.color.primaryColor}` : 'none'};
  }
  background: ${(props) => props.checked ? props.color || props.theme.color.primaryColor : 'none'};
`;

export const CheckboxWrapper = styled.div.attrs(applyDefaultTheme) <ICheckboxIconProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    ${CheckboxIconWrapper} {
      border: ${(props) => !props.checked ? `2px solid ${props.color || props.theme.color.primaryColor}` : 'none'};
    }
  }
  ${props => {
    return css`
      color: ${props.theme.color.textCommonPrimary};
    `; 
  }}
  ${props => {
    if (props.disabled) {
      return css`
          cursor: not-allowed;
          opacity: 0.5;
          pointer-events: none;
        `;
    }
    return css``;
  }}
`;
