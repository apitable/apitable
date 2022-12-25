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
import { ListDeprecate } from '../list_deprecate';
import { Typography } from 'components/typography';
import { applyDefaultTheme } from 'theme';

export const StyledOptionWrapper = styled(ListDeprecate.Item).attrs(applyDefaultTheme)<{ active: boolean; disabled?: boolean }>`
  margin: 0 8px;
  padding: 8px;
  height: auto;
  display: flex;
  align-items: flex-start;
  flex-flow: column;
  justify-content: center;
  cursor: pointer;

  ${props => {
    if (props.disabled) {
      return css`
        cursor: not-allowed;
        opacity: 0.5;
      `;
    }
    return;
  }}
  .label {
    ${(props) => {
    const { deepPurple } = props.theme.color;
    if (props.active) {
      return css`
          color: ${deepPurple[500]};
        `;
    }
    return;
  }}
  }


`;

export const StyledDropdownContainer = styled.div`
  color: ${props => {
    return `
      background: ${props.theme.color.defaultBg};
    `;
  }};
`;

export const StyledLabel = styled(Typography)`
  width: 100%;
`;

export const StyledSubLabel = styled(Typography).attrs(applyDefaultTheme)`
  width: 100%;
  color: ${props => {
    return props.theme.color.black[500];
  }};
`;
