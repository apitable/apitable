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
import { IRadioGroup } from './interface';

export const RadioGroupStyled = styled.div.attrs(applyDefaultTheme) <IRadioGroup>`
  display: flex;
  label {
    ${props => {
    if (props.block) {
      return css`
          flex: 1;
        `;
    }
    return '';
  }}
    .radio-text {
      ${props => {
    if (props.block && props.isBtn) {
      return css`
            font-size: 13px;
            margin: 0 auto;
          `;
    }
    return '';
  }}
    }
  }
  ${props => {
    if (props.isBtn) {
      const { color } = props.theme;
      return css`
        display: ${props.block ? 'flex' : 'inline-flex'};
        flex-flow: row wrap;
        padding: 4px;
        background-color: ${color.bgControlsDefaultSolid};
      `;
    }
    if (props.row) {
      return css`
        flex-flow: row wrap;
      `;
    }
    return css`
      flex-flow: column wrap;
    `;
  }}
  ${props => {
    if (props.isBtn) {
      return `
        border-radius: 4px;
      `;
    }
    return '';
  }}
`;