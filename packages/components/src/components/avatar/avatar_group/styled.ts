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
import { AvatarSizeConfig } from '../styled';
import { IAvatarGroup } from './interface';

export const AvatarGroupStyled = styled.div<Pick<IAvatarGroup, 'size'>>`
  display: inline-flex;
  /* flex-direction: row-reverse; */
  & > span {
    &:first-child {
      margin-left: 0;
    }
    box-sizing: content-box;
    ${(props) => {
      const sizeKey = props.size || 'm';
      const { size, borderWidth } = AvatarSizeConfig[sizeKey];
      return css`
        margin-left: -${size / 4}px;
        border: ${borderWidth}px solid #fff;
      `;
    }}
`;
