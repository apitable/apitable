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

import Color from 'color';
import { black, blackBlue } from 'colors';
import styled, { createGlobalStyle, css } from 'styled-components';
import { applyDefaultTheme } from 'styles';
import { CommonList } from './common_list/common_list';

export const OutsideListCls = styled(CommonList)`
  & > div:last-child {
    padding: 0 8px;
  }
`;

export const TriggerDivCls = styled.div.attrs(applyDefaultTheme) <{ focus: boolean }>`
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid transparent;
  padding: 0 28px 0 8px;
  display: flex;
  align-items: center;
  position: relative;
  height: 40px;
  background-color: ${black[100]};
  user-select: none;
    /* color: ${black[500]}; */
  outline: none;

  ${props => {
    return props.focus && css`
      background-color: ${blackBlue[50]};
    `;
  }}
`;

export const ContentSpan = styled.span`
  flex: 1;
  display: flex;
  align-items: center;

  .optionIcon {
    display: flex;
    align-items: center;
    margin-right: 4px;
  }

  .placeholder {
    display: inline-block;
    font-size: 13px;
    color: ${blackBlue[500]};
  }
`;

export const PrefixIcon = styled.span`
  height: 100%;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding-right: 4px;
`;

export const SuffixIcon = styled(PrefixIcon) <{ rotate: boolean }>`
  position: absolute;
  right: 8px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: transform 0.3s;
  ${props => props.rotate && css` transform: rotate(180deg); `}
`;

export const GlobalStyle = createGlobalStyle`
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const hightLightCls = styled.div.attrs(applyDefaultTheme)`
  background: none;
  padding: 0;
`;

export const SelectDropDownWrapper = styled.div<{ width: string; minWidth: string }>`
  width: ${(props) => props.width};
  min-width: ${(props) => props.minWidth};
  padding: 4px 0;
  background-color: ${blackBlue[50]};
  box-shadow: 0px 3px 10px ${Color(black[1000]).alpha(0.1).string()};
  border-radius: 4px;
`;

export const OptionOutside = styled(CommonList.Option)`
  padding: 0 8px;
  

  ${prop => {
    if (prop.disabled) {
      return css`
        color: ${black[300]};
        cursor: not-allowed;

        .prefixIcon svg {
          fill: currentColor;
        }
      `;
    }
  }};

  @media (any-hover: hover) {
    &:hover {
      ${(props) => {
    const { fc6 } = props.theme.color;
    return css`
          background-color: ${fc6};
          border-radius: 8px;
        `;
  }};
    }
  }

  &:global {
    &.isChecked {
      span[class*='prefixIcon'] {
        svg {
          fill: currentColor;
        }
      }

    }
  }
`;
