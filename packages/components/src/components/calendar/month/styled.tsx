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
import { Drawer } from 'antd';
import { applyDefaultTheme } from 'theme';

export const MonthListDiv = styled.div.attrs(applyDefaultTheme) <{ isMobile: boolean }>`
  min-height: 450px;
  width: 100%;
  position: relative;
  .moreTask {
      ${props => {
    if (!props.isMobile) {
      return '';
    }
    return `
    margin-left: 0 !important;
    transform: scale(0.9);
      `;
  }}
  }
  ${css`
    .task {
      position: absolute;
      z-index: 1;
      &.draggable > .list {
        cursor: auto;
        &:hover {
          border-color: #E9E9F5;
        }
      }
      &.endClose > .list {
        margin-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &.startClose > .list {
        margin-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      &.isMove {
        z-index: 2;
      }
      .warning {
        position: absolute;
        right: 8px;
        top: 4px;
      }
    }
    .list {
      cursor: pointer;
      position: relative;
      padding: 0 8px;
      margin: 0 6px;
      box-sizing: border-box;
      border-radius: 4px;
      font-size: 13px;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      ${props => css`
      background-color: ${props.theme.color.defaultBg};
      color: ${props.theme.color.fc1};
    `}
    }
    .left-resize,
    .right-resize {
      user-select: none;
      position: absolute;
      top: 0;
      z-index: 1;
      height: 100%;
      width: 16px;
      cursor: col-resize;
    }
    .left-resize {
      left: 0;
    }
    .right-resize {
      right: 0;
    }
  `}
`;

export const DayDiv = styled.div.attrs(applyDefaultTheme)`
  flex: 1;
  height: 100%;
  ${props => css`
    border-left: 1px solid ${props.theme.color.fc5};
  `}
  position: relative;
`;

export const DaySpan = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 13px;
  font-weight: 500;

  ${() => css`
    color: #C9C9C9;
  `}
`;

export const MoreDiv = styled.div.attrs(applyDefaultTheme)`
  max-height: 560px;
  width: 240px;
  margin: -12px -16px;
  ${props => css`
    color: ${props.theme.color.shadowCommonHigh};
  `}
  header {
    display: flex;
    flex-wrap: nowrap;
    height: 48px;
    align-items: center;
    padding: 0 12px;
    justify-content: space-between;
  }
`;

export const MoreListDiv = styled.div.attrs(applyDefaultTheme)<{ isMobile: boolean }>`
  ${props => {
    if (!props.isMobile) {
      return `
        width: 240px;
      `;
    }
    return '';
  }}
  .moreList {
    ${props => {
    if (!props.isMobile) {
      return `
        overflow-y: overlay !important;
      `;
    }
    return '';
  }}
  }
  .list {
      cursor: pointer;
      position: relative;
      padding: 0 8px;
      box-sizing: border-box;
      border-radius: 4px;
      font-size: 13px;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      ${props => css`
        background-color: ${props.theme.color.defaultBg};
        color: ${props.theme.color.fc1};
      `}
      ${props => {
    if (!props.isMobile) {
      return `
          margin: 0 6px;
          `;
    }
    return '';
  }}
    }
`;

export const MoreHeader = styled.span`
  margin-left: 8px;
`;

export const DrawerStyled = styled(Drawer)`
  &.taskMobileModal {
    .ant-drawer-content {
      background: var(--fc6);
      border-radius: 16px 16px 0 0;
    }
    .ant-drawer-body {
      padding: 8px 16px;
    }
    .ant-drawer-header {
      background: var(--fc6);
      border: 0;
    }
  }
`;

export const ListItemStyled = styled.div`
  padding: 0 8px;
`;

