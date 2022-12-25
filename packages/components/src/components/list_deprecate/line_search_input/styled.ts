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
import { IWrapperDivProps } from './interface';
import { applyDefaultTheme } from 'theme';

const INPUT_SIZE = {
  small: '24px',
  default: '32px',
  large: '40px',
};

export const StyledSearchInputContainer = styled.div.attrs(applyDefaultTheme) <IWrapperDivProps>`
  ${props => css`
    color: ${props.theme.color.fc1};
    background: ${props.theme.color.highestBg};
    border-bottom: 1px solid ${props.theme.color.lineColor};
  `}
  display: flex;
  align-items: center;
  padding: 0 20px 0;
  position: relative;

  ${props => {
    if (props.size) {
      return css`height: ${INPUT_SIZE[props.size]};`;
    }
    return css`height: ${INPUT_SIZE['default']};`;
  }};

  svg {
    cursor: pointer;
  }

  input {
    border: none;
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: transparent;
    ${props => css`
      color: ${props.theme.color.fc1};
    `}

    &:focus {
      outline: none;
    }
  }

  .suffixIcon {
    position: absolute;
    right: 0;
  }

  &:focus-within {
    ${props => css`border-bottom: 1px solid ${props.theme.color.deepPurple[500]};`}
    .prefixIcon {
      svg {
        ${props => css`fill: ${props.theme.color.deepPurple[500]};`}
      }
    }
  }
`;

export const PrefixIcon = styled.span`
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
`;

export const SuffixIcon = styled.span`
  position: absolute;
  right: 0;
`;
