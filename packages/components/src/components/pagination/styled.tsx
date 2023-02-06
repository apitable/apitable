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

import { editRgbaOpacity } from 'helper';
import { TextInput } from 'components/text_input';
import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { IPaginationStatus } from './interface';

export const PaginationContainer = styled.div.attrs(applyDefaultTheme)`
  display: flex;
  align-items: center;
`;

export const PaginationItem = styled.button.attrs(applyDefaultTheme)<IPaginationStatus>`
  min-width: 24px;
  height: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: color, background-color .3s;
  box-sizing: border-box;
  flex-shrink: 0;
  outline: none;
  padding: 0 2px;
  border: none;
  background: none;
  ${(props) => {
    return css`
      margin-right: ${props.lastRangeChild ? 0 : '4px'};
    `;
  }}

  ${(props) => {
    const { disabled, theme, selected } = props;
    const { textCommonPrimary, bgBglessHover, textBrandDefault } = theme.color;
    if (disabled) {
      return css`
        cursor: not-allowed;
        color: ${editRgbaOpacity(textCommonPrimary, 0.5)}
      `;
    }
    if (selected) {
      return css`
        color: ${textBrandDefault};
        border: 1px solid ${textBrandDefault};
        cursor: pointer;
      `;
    }
    return css`
      color: ${textCommonPrimary};
      cursor: pointer;

      &:hover {
        background-color: ${bgBglessHover};
      }
    `;
  }}
`;

export const PaginationArrow = styled.div.attrs(applyDefaultTheme)<IPaginationStatus>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => {
    const { lastRangeChild } = props;
    if (lastRangeChild) {
      return css`
        margin-left: 4px;
      `;
    }
    return css`
      margin-right: 4px;
    `;
  }}
  ${(props) => {
    const { theme, disabled } = props;
    const { textCommonPrimary, bgBglessHover } = theme.color;
    return css`
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      svg {
        fill: ${disabled ? editRgbaOpacity(textCommonPrimary, 0.5) : textCommonPrimary};
      }
      &:hover {
        background-color: ${disabled ? 'none' : bgBglessHover};
      }
    `;
  }}
`;

export const PaginationEllipse = styled.div.attrs(applyDefaultTheme)<IPaginationStatus>`
  width: 24px;
  height: 24px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => {
    const { disabled, theme } = props;
    const { textCommonPrimary } = theme.color;
    return css`
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      color: ${disabled ? editRgbaOpacity(textCommonPrimary, 0.5) : textCommonPrimary}
    `;
  }}
`;

export const PaginationTotal = styled.div.attrs(applyDefaultTheme)`
  margin-right: 25px;
  font-size: 12px;
  color: ${(props) => props.theme.color.textCommonPrimary};
`;

export const PaginationQuickJump = styled.div.attrs(applyDefaultTheme)`
  margin-left: 24px;
  font-size: 12px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.color.textCommonPrimary};
`;

export const PaginationInput = styled(TextInput).attrs(applyDefaultTheme)`
  width: 48px;
  margin: 0 8px;
`;