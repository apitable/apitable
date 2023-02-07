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
import Color from 'color';
import { applyDefaultTheme } from 'theme';
import { convertHexToRGB } from 'helper';

export const CalendarDiv = styled.div.attrs(applyDefaultTheme)`
  position: relative;
  border-radius: 10px;
  padding: 5px;
  &.mobile {
    .months {
      height: 100%;
      .day-value {
        font-size: 12px;
        left: 2px;
        letter-spacing: -1px;
      }
    }
    .list {
      margin: 0 2px !important;
    }
    .calendar-header {
      justify-content: space-between;
      padding-left: 0;
      button:hover {
        color: ${(props) => props.theme.color.bgBrandHover};
        background: inherit;
      }
    }
    .btn-pre-month,
    .btn-next-month{
      & > div:hover {
        background: inherit;
      }
    }
  }
  .weeks {
    ${props => css`
      border-bottom: 1px solid ${props.theme.color.fc5};
    `}
    line-height: 32px;
    width: 100%;
    .wk {
      opacity: 0.5;
    }
  }
  .change-month {
    position: absolute;
    z-index: 3;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 32px;
    background-color: ${props => props.theme.color.bgBrandDefault};
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
  }
  ${css`
    .months {
      .today .day-value {
        top: 2px;
      }
      .curMonth {
        .day-value {
          ${props => css`
          color: ${props.theme.color.fc1};
        `}
        }
        &.weekend .day-value {
          ${props => css`
          color: ${props.theme.color.fc4};
        `}
        }
      }
      .week-row {
        position: relative;
        ${props => css`
          border-bottom: 1px solid ${props.theme.color.fc5};
          &:last-child {
            border-bottom: 1px solid ${props.theme.color.fc5};
          }
        `}
        .moreTask {
          color: ${(props) => props.theme.color.thirdLevelText};
          justify-content: flex-start;
          margin-left: 8px;
          & > span {
            font-size: 12px;
            flex-shrink: 0;
            letter-spacing: -1px;
          }
          &:hover {
            color: ${(props) => props.theme.color.bgBrandHover};
          }
        }
      }
    }
    .row-bg {
      display: flex;
      height: 100%;
      .day:first-child {
        border-left: 0;
      }
    }
    .weekend {
      ${props => css`
        background-color: ${convertHexToRGB(props.theme.color.fc6, 0.4)};
      `}
      &.today {
        ${props => css`
          border-top: 2px solid ${Color(props.theme.color.tangerine[500]).toString()};
        `}
        .day-value {
          ${props => css`
            background-color: ${Color(props.theme.color.tangerine[500]).toString()};
          `}
        }
      }
    }
    .active {
      background-color: ${props => props.theme.color.bgBrandActive};
    }
    .today {
      ${props => css`
        border-top: 2px solid ${props.theme.color.fc0};
      `}
      .day-value {
        display: flex;
        width: 20px;
        height: 20px;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: 100%;
        color: #fff !important;
        ${props => css`
          background-color: ${props.theme.color.fc0};
        `}
      }
    }
  `}
`;

export const HeaderDiv = styled.div.attrs(applyDefaultTheme)`
  display: flex;
  align-items: center;
  line-height: 32px;
  padding: 4px 12px;
  ${props => {
    const { textCommonPrimary, bgBrandDefault, borderBrandDefault } = props.theme.color;
    return css`
      button {
        background-color: transparent;
        border: 1px solid ${borderBrandDefault};
        color: ${bgBrandDefault};
        font-size: 12px;
        line-height: 24px;
        padding: 0px 12px;
        height: auto;
      }
      .date {
        font-weight: bolder;
        text-align: center;
        width: 88px;
        color: ${textCommonPrimary}
      }
    `;
  }}
`;

export const HeaderLeftDiv = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
  ${css`
    & > div {
      box-sizing: unset;
    }
  `}
`;

export const WeekDiv = styled.div.attrs(applyDefaultTheme)`
  text-align: center;
  font-size: 13px;
  width: 14.285%;
  display: inline-block;
  ${props => css`
    color: ${props.theme.color.fc1};
  `}
`;

