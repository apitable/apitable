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
import { fontVariants } from 'helper';
import { ITypographyProps } from './interface';

export const TypographyBase = styled.div.attrs(applyDefaultTheme) <Required<ITypographyProps> & {
  cssTextOverflow: boolean, cssLineClamp: boolean, rows: number 
}>`
  margin: 0;
  padding: 0;
  word-break: break-word;
  ${props => fontVariants[props.variant]}
  ${props => {
    return css`
    color: ${props.color || props.theme.color.fc1};
    text-align: ${props.align};
  `;}
}}

  ${props => props.cssTextOverflow && css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}

  ${props => props.cssLineClamp && css`
    display: -webkit-box;
    -webkit-line-clamp: ${props.rows};
    -webkit-box-orient: vertical;
    overflow-wrap: break-word;
    overflow: hidden;
  `}
`;
