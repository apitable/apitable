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
import { IOptionItem } from './interface';

type IOptionItemStyled = Omit<IOptionItem, 'text'>;

export const OptionsWrapperStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const OptionItemStyled = styled.div<IOptionItemStyled>`
  display: inline-block;
  padding: 0 8px;
  margin: 3px 8px 2px 0;
  border-radius: 10px;
  max-width: 100%;
  font-size: 12px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${props => {
    const { bg, textColor } = props;
    return css`
      color: ${textColor};
      background-color: ${bg};
    `;
  }}
`;