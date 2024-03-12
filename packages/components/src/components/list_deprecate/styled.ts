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
import { IOption } from 'components/select/interface';
import { applyDefaultTheme } from 'theme';
import { Typography } from 'components/typography';

export const StyledItemContainer = styled.div.attrs(applyDefaultTheme)<IOption & { height: number }>`
  position: relative;
  width: 100%;
  height: ${(props) => props.height + 'px'};

  ${(props) => {
    if (props.disabled) {
      return css`
        cursor: not-allowed;
        color: ${(props) => props.theme.color.fc3};

        .svg {
          fill: currentColor;
        }
      `;
    }
    return;
  }}

  padding-left: ${(props) => {
    if (props.prefixIcon) {
      return '20px';
    }
    return '';
  }};

  padding-right: ${(props) => {
    if (props.suffixIcon) {
      return '20px';
    }
    return '';
  }};

  &.paddingPreFixIcon {
    padding-left: 20px;
  }

  &.paddingSuffixIcon {
    padding-right: 20px;
  }

  svg {
    vertical-align: -0.225em;
  }

  .suffixIcon,
  .prefixIcon {
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
  }

  .suffixIcon {
    right: 0;
  }

  .prefixIcon {
    left: 0;
  }

  .optionLabel {
    width: 100%;
    height: 100%;
    display: block;
    font-size: 13px;
    line-height: 40px;
  }
`;

export const WrapperDiv = styled.div.attrs(applyDefaultTheme)`
  &:focus {
    outline: none;
  }

  @media (any-hover: hover) {
    .hoverBg {
      ${(props) => css`
        background: ${props.theme.color.highestBg};
      `}
    }
  }

  @media screen and(max-width: 768) {
    box-shadow: none;
    background: none;
    height: 100%;

    .listBox {
      overflow: auto;
      max-height: 442px; //FIXME: @sujian
    }

    .optionItem {
      height: 48px;
      line-height: 48px;
      ${(props) => css`
        border-bottom: 1px solid ${props.theme.color.blackBlue[200]};
      `}
    }

    .footerContainer {
      font-size: 14px;
    }

    .noResult {
      font-size: 14px;
    }
  }
`;

export const StyledSearchInputWrapper = styled.div`
  padding: 8px 16px;
`;

export const ResultSpan = styled.span.attrs(applyDefaultTheme)`
  font-size: 11px;
  padding-bottom: 8px;
  height: 30px;
  line-height: 30px;
  color: ${(props) => props.theme.color.fc3};
  width: 100%;
  text-align: center;
  display: inline-block;

  @media screen and(max-width: 768px) {
    font-size: 14px;
  }
`;

export const StyledListWrapper = styled.div`
  max-height: 340px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 8px;
  padding-right: 8px;

  @media screen and(max-width: 768px) {
    overflow: auto;
    max-height: 442px;
  }
`;

export const FootWrapper = styled.div`
  &:hover {
    ${(props) => css`
      background: ${props.theme.color.blackBlue[100]};
    `}
  }

  @media screen and(max-width: 768px) {
    font-size: 14px;
  }
`;

export const StyledListItem = styled(Typography).attrs(applyDefaultTheme)<{ disabled?: boolean; selected?: boolean; active?: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 8px;

  ${(props) =>
    !props.disabled &&
    props.active &&
    css`
      background: ${props.theme.color.bgBglessHover};
    `}

  ${(props) =>
    !props.disabled &&
    props.selected &&
    css`
      background: ${props.theme.color.bgBrandLightDefault};
    `}

  ${(props) =>
    !props.disabled &&
    css`
      border-radius: 4px;
      &:hover {
        background: ${props.theme.color.bgBglessHover};
      }
      &:active {
        background: ${props.theme.color.bgBglessActive};
      }
    `}

  @media screen and(max-width: 768px) {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #eee;
  }
`;
