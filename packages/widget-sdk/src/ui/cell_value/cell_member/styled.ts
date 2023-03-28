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

export const CellMemberWrapperStyled = styled.div`
  display: flex;
`;

export const CellMemberStyled = styled.div`
  display: flex;
  padding: 4px 10px 4px 2px;
  background-color: var(--fc11);
  border-radius: 16px;
  margin: 2px 8px 2px 0;
`;

export const AvatarStyled = styled.div<{ avatar?: string; bg?: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  user-select: none;
  border: 1px solid var(--shadowColor);
  background-position: center;
  background-color: rgb(255, 255, 255);
  ${props => {
    if (props.avatar) {
      return css`
        background-image: url(${props.avatar})
      `;
    }
    return css``;
  }}
  ${props => {
    if (props.bg) {
      return css`
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${props.bg};
        color: #fff;
        font-size: 10px;
      `;
    }
    return css``;
  }}
`;

export const NameStyled = styled.span`
  line-height: 20px;
  padding-left: 2px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

