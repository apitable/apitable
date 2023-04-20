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

export const ModalWrapper = styled.div <{ centered?: boolean; zIndex?: number }>`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  ${props => {
    return css`
      z-index: ${props.zIndex || 1000};
    `;
  }}
  ${props => {
    if (props.centered) {
      return css`
        display: flex;
        justify-content: center;
        align-items: center;
      `;
    }
    return;
  }};
  animation-duration: 0.24s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
  animation-name: dialogZoomIn;
  animation-play-state: running;

  @keyframes dialogZoomIn {
    0% {
      opacity: 0;
      transform: scale(0, 0);
    }
    100% {
      opacity: 1;
      transform: scale(1, 1);
    }
  }
  box-shadow: 0px 4px 12px rgba(27, 31, 35, 0.15);
`;

export const ModalContentWrapper = styled.div <{ centered?: boolean; width?: number | string; }>`
  ${props => {

    let width: number | string = props.width || 520;

    if (typeof width === 'number') { width = `${width}px`; }

    return css`
      width: ${width};
    `;
  }}
  position: relative;
  box-sizing: border-box;
  margin: auto;
  ${props => !props.centered && css`
    top: 100px;
  `};

`;

export const ModalContent = styled.div.attrs(applyDefaultTheme)`
  position: relative;
  ${props => {
    return css`
      background-color: ${props.theme.color.highBg};
    `;
  }}
  border-radius: 8px;
  box-sizing: border-box;
`;

export const ModalHeader = styled.div`
  box-sizing: border-box;
  padding: 24px;
`;

export const CloseIconBox = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 24px;
  right: 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 24px;
`;

export const ModalMask = styled.div <{ zIndex?: number }>`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  ${props => {
    return css`
      z-index: ${props.zIndex || 1000};
    `;
  }}

  @keyframes dialogFadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  animation-duration: 0.24s;
  animation-fill-mode: both;
  animation-timing-function: fadeIn;
  animation-name: dialogFadeIn;
  animation-play-state: running;
`;