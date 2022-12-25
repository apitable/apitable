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
import { ISpaceProps } from './interface';
import { FLEX_ALIGN } from './constant';

export const SpaceStyled = styled.div<ISpaceProps>`
  display: inline-flex;
  align-items: center;
  ${props => {
    const size = props.size;
    if (typeof size === 'number') {
      return css`
        gap: ${size}px;
      `;
    } else if (Array.isArray(size)) {
      return css`
        gap: ${size[1]}px ${size[0]}px;
      `;
    }
    return css`
      gap: 8px;
    `;
  }}
  ${props => {
    if (props.vertical) {
      return css`
        flex-direction: column;
      `;
    }
    return '';
  }}
  ${props => {
    if (props.wrap) {
      return css`
        flex-wrap: wrap;
      `;
    }
    return '';
  }}
  ${props => {
    if (props.align) {
      return css`
        align-items: ${FLEX_ALIGN[props.align]};
      `;
    }
    return '';
  }}
`;

export const SpaceItemStyled = styled.div<ISpaceProps>`
  display: flex;
  align-items: center;
`;

export const SplitStyled = styled.span<ISpaceProps>`
  ${props => {
    if (props.size) {
      return css`
        margin-right: ${props.size}px;
      `;
    }
    return `
      margin-right: 8px;
    `;
  }}
  height: 0.9em;
  border-left: 1px solid #E5E9ED;
`;

