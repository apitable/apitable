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
import { IListProps } from './interface';

export const ListStyled = styled.div.attrs(applyDefaultTheme)<IListProps>`
  box-sizing: border-box;
  font-size: 14px;
  ${props => {
    if (props.bordered) {
      return css`
        border: 1px solid ${props.theme.color.borderCommonDefault};
        border-radius: 4px;
      `;
    }
    return '';
  }}
  & > div:last-child {
    border-bottom: none;
  }
`;

export const ListHeaderStyled = styled.div.attrs(applyDefaultTheme)`
  padding: 8px 16px;
  ${(props) => {
    return css`
      color: ${props.theme.color.textCommonPrimary};
      border-bottom: 1px solid ${props.theme.color.borderCommonDefault};
    `;
  }}
`;

export const ListFooterStyled = styled.div.attrs(applyDefaultTheme)`
  padding: 8px 16px;
  ${(props) => {
    return css`
      color: ${props.theme.color.textCommonPrimary};
    `;
  }}
`;

export const ListItemStyled = styled.div.attrs(applyDefaultTheme)`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) => {
    return css`
      color: ${props.theme.color.textCommonPrimary};
      border-bottom: 1px solid ${props.theme.color.borderCommonDefault};
    `;
  }}
  &:last-child {
    border-bottom: none;
  }
`;

export const ListItemActionsStyled = styled.div`
  flex: 0 0 auto;
`;