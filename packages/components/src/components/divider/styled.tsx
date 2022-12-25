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

import { fontVariants } from 'index';
import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { IDividerStyledType } from './interface';

export const DividerStyled = styled.div.attrs(applyDefaultTheme)<IDividerStyledType>`
  border: none;
  list-style: none;
  background-color: transparent;
  font-size: 16px;
  box-sizing: border-box;
  display: flex;
  ${props => fontVariants[props.typography || 'body2']}

  ${props => {
    const borderBg = props.theme.color.lineColor;
    const strokeStyle = props.dashed ? 'dashed' : 'solid';

    if (props.hasChildren) {
      return css`
        &::before, &::after {
          position: relative;
          border-top: 1px ${strokeStyle} ${borderBg};
          top: 50%;
          content: "";
          transform: translateY(50%);
        }
        &::before {
          width: ${props.textAlign === 'left' ? 0 : '100%'}
        }
        &::after {
          width: ${props.textAlign === 'right' ? 0 : '100%'}
        }
        & > div {
          padding-left: ${props.textAlign === 'left' ? 0 : undefined};
          padding-right: ${props.textAlign === 'right' ? 0 : undefined};
        }
      `;
    }

    if (props.orientation === 'vertical') {
      return css`
        width: 0px;
        height: .9em;
        border-right: 1px ${strokeStyle} ${borderBg};
        display: inline-block;
        margin: 0 16px;
        position: relative;
        top: 0.05em;
      `;
    }

    return css`
      width: 100%;
      height: 0px;
      border-top: 1px ${strokeStyle} ${borderBg};
    `;
  }}
`;

export const DividerChildStyled = styled.div`
  display: inline-block;
  padding: 0 1em;
  white-space: nowrap;
`;