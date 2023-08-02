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

import { useProviderTheme } from 'hooks';
import React from 'react';
import styled from 'styled-components';

const LoadingSvg = styled.svg`
  margin: auto; 
  background: none; 
  display: block; 
  shape-rendering: auto;
`;

export const Loading = ({ currentColor = false, strokeWidth = 3 }: { currentColor?: boolean; strokeWidth?: number }) => {
  const theme = useProviderTheme();
  const fontColor = currentColor ? 'currentColor' : theme.color.primaryColor;
  return (
    <LoadingSvg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid" width="1em" height="1em">
      <circle cx="12" cy="12" fill="none" stroke={fontColor} strokeWidth={strokeWidth} r="10" strokeDasharray="45 35">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 12 12 ;360 12 12" keyTimes="0;1" />
      </circle>
    </LoadingSvg>
  );
};