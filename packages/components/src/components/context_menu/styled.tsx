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
import { Typography } from '../typography';
import { IContextMenuStyleProps } from './interface';
import { convertHexToRGB } from '../../helper/color_helper';

export const StyledMenuContainer = styled.div.attrs(applyDefaultTheme)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
`;

export const StyledSubMenu = styled.div.attrs(applyDefaultTheme)`
  width: 240px;
  height: fit-content;
  position: fixed;
  z-index: 1001;
  opacity: 0;
  left: 0;
  top: 0;
  box-sizing: border-box;
  ${props => {
    const { color } = props.theme;
    return css`
        background: ${color.highestBg};
        box-shadow: ${color.shadowCommonHighest};
      `;
  }};
  padding: 4px 0;
  border-radius: 4px;
`;

export const StyledMenuItem = styled.div.attrs(applyDefaultTheme)<IContextMenuStyleProps>`
  width: calc(100% - 16px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 8px;
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  margin: 0 8px;
  box-sizing: border-box;
  font-size: 14px;
  position: relative;

  ${(props) => {
    if (props.disabled) {
      const { palette, color } = props.theme;
      const disableColor = palette.type === 'light' ? color.fc12 : convertHexToRGB('#fff', 0.5);
      return css`
        div, svg, p {
          color: ${disableColor} !important;
          fill: ${disableColor} !important;
        }
      `;
    }
    return '';
  }}

  ${(props) => {
    if (props.isGroup) {
      return css`
        &:after {
          content: '';
          display: block;
          position: absolute;
          left: 8px;
          bottom: 0;
          height: 1px;
          width: calc(100% - 16px);
          background: ${props.theme.color.lineColor};
        }
      `;
    }
    return '';
  }}

  svg {
    fill: ${props => props.theme.color.textCommonTertiary};
    width: 16px;
    height: 16px;
    font-size: 12px;
    margin-right: 4px;
    flex-shrink: 0;
  }

  &:hover {
    border-radius: 4px;
    ${props => {
    if (props.disabled) {
      return '';
    }
    return css`
          background: ${props.theme.color.fill0};
        `;
  }};
    }
  &:active {
    border-radius: 4px;
    ${props => {
    if (props.disabled) {
      return '';
    }
    return css`
          background: ${props.theme.color.fill1};
        `;
  }};
  }
`;

export const StyledMenuItemContent = styled(Typography).attrs(applyDefaultTheme)`
  flex: 1;
  width: 0;
`;

export const StyledMenuItemArrow = styled.div.attrs(applyDefaultTheme)`
  width: 10px;
  height: 10px;
  display: flex;
  align-items: center;
  svg {
    max-width: 100%;
    max-height: 100%;
  }
`;

export const StyledMenuShadow = styled.div.attrs(applyDefaultTheme)`
  position: fixed;
  height: 20px;
  z-index: 1002;
  display: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  pointer-events: none;
  background: linear-gradient(
    rgba(253, 253, 253, 0.5),
    rgba(253, 253, 253, 0.92) 81.48%,
    rgba(253, 253, 253, 1) 100%
  );
`;

export const StyledMenuItemExtra = styled.div.attrs(applyDefaultTheme)`
  margin-left: 4px;
  color: ${props => props.theme.color.fc3};
  font-size: 13px;
  text-align: right;
  text-transform: capitalize;
`;
