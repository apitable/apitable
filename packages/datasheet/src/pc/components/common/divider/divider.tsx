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

import * as React from 'react';
import { useThemeColors } from '@apitable/components';

interface IDividerProps {
  height?: number;
  color?: string;
  marginTop?: number;
  marginBottom?: number;
  className?: string;
}

export const Divider: React.FC<React.PropsWithChildren<IDividerProps>> = (props) => {
  const colors = useThemeColors();
  const { height = 1, color = colors.lineColor, marginTop = 8, marginBottom = 16, className } = props;
  const style: React.CSSProperties = {
    width: '100%',
    height,
    backgroundColor: color,
    marginTop,
    marginBottom,
    flexShrink: 0,
  };
  return <div style={style} className={className} />;
};
