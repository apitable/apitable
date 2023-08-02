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
import { convertHexToRGB, editRgbaOpacity } from '../../helper/color_helper';

export const RadioLabelStyled = styled.label.attrs(applyDefaultTheme)`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  margin-right: 16px;
  &.radio-label-btn {
    cursor: pointer;
    margin-right: 4px;
    padding: 0 16px;
    line-height: 32px;
    transition: background 0.2s ease 0s;
    border-radius: 4px;
    ${(props) => {
    const { color } = props.theme;
    const hoverBg = color.bgControlsHoverSolid;
    const activeBg = color.bgControlsActiveSolid;
    return css`
        color: ${color.fc1};
        &:not(.radio-label-btn-checked) {
          background-color: ${color.bgControlsDefaultSolid};
        }
        &:hover:not(.radio-label-btn-disabled) {
          background-color: ${hoverBg};
        }
        &:active:not(.radio-label-btn-disabled) {
          background-color: ${activeBg};
        }
      `;
  }}
    .radio-btn {
      padding: 0;
    }
    &:last-child {
      margin: 0;
    }
  }
  &.radio-label-btn-checked {
    ${(props) => {
    const { color } = props.theme;
    return css`
        color: ${color.primaryColor};
        background-color: ${color.defaultBg};
      `;
  }}
    font-weight: 600;
  }
  @keyframes radioEffect {
    0% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(0.8);
      opacity: 0;
    }
  }
  .radio-checked::after {
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: radioEffect 0.36s ease-in-out;
    animation-fill-mode: both;
    content: '';
    ${(props) => {
    const { color } = props.theme;
    return css`
        border: 1px solid ${color.primaryColor};
      `;
  }}
  }
  .radio-disabled,
  .radio-disabled + span {
    cursor: not-allowed;
    ${(props) => {
    const { color, palette } = props.theme;
    const resColor = palette.type === 'light' ? convertHexToRGB(color.fc1, 0.5) : editRgbaOpacity(color.fc1, 0.5);
    return css`
      color: ${resColor};
    `;
  }}
  }
`;

export const RadioSpanStyled = styled.span.attrs(applyDefaultTheme)`
  box-sizing: border-box; 
  display: inline-flex;
  position: relative;
  cursor: pointer;
  padding: 8px;
  ${(props) => {
    const { color } = props.theme;
    return css`
      &:not(.radio-disabled):hover .radio-inner {
        border-color: ${color.primaryColor};
      }
      &.radio-disabled {
        .radio-inner {
          &::after {
            background-color: #999;
          }
        }
        input:checked + span {
          border-color: #999;
        }
      }
    `;
  }}
`;

export const RadioInputStyled = styled.input.attrs(applyDefaultTheme)`
  position: absolute;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  &:checked + span {
    ${(props) => {
    const { color } = props.theme;
    return css`
        border-color: ${color.primaryColor};
      `;
  }}
    &:after {
      transform: scale(1);
      opacity: 1;
      transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }
  }
`;

export const RadioInnerStyled = styled.span.attrs(applyDefaultTheme)`
  box-sizing: border-box;
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: all 0.3s;
  ${(props) => {
    const { color } = props.theme;
    return css`
      border: 1px solid #ccc;
      background-color: ${color.defaultBg};
    `;
  }}

  &::after {
    position: absolute;
    top: 3px;
    left: 3px;
    display: table;
    width: 8px;
    height: 8px;
    border-top: 0;
    border-left: 0;
    border-radius: 8px;
    transform: scale(0);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    content: ' ';
    ${(props) => {
    const { color } = props.theme;
    return css`
        background-color: ${color.primaryColor};
      `;
  }}
  }
`;

export const RadioTextStyled = styled.span.attrs(applyDefaultTheme)`
  font-size: 14px;
  ${(props) => {
    const { color } = props.theme;
    return css`
      color: ${color.fc1};
      `;
  }}
`;