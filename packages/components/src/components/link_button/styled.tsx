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
    const { textLinkDefault } = props.theme.color;
    const color = props.color || textLinkDefault;
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
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-decoration-line: none;
`;