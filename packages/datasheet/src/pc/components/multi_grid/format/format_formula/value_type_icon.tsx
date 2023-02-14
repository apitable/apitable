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

import { BasicValueType } from '@apitable/core';
import { useThemeColors } from '@apitable/components';
import * as React from 'react';
import CheckBoxIcon from 'static/icon/datasheet/column/datasheet_icon_checkbox.svg';
import NumberIcon from 'static/icon/datasheet/column/datasheet_icon_figure.svg';
import StringIcon from 'static/icon/datasheet/column/datasheet_icon_text.svg';
import DateTimeIcon from 'static/icon/datasheet/column/datasheet_icon_calendar.svg';

const IconMap = {
  [BasicValueType.Array]: StringIcon,
  [BasicValueType.DateTime]: DateTimeIcon,
  [BasicValueType.Number]: NumberIcon,
  [BasicValueType.String]: StringIcon,
  [BasicValueType.Boolean]: CheckBoxIcon,
};

interface IViewIcon {
  valueType: BasicValueType;
  width?: number;
  height?: number;
  fill?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

export const ValueTypeIcon: React.FC<React.PropsWithChildren<IViewIcon>> = props => {
  const colors = useThemeColors();
  const { valueType, width = 16, height = 16, fill = colors.thirdLevelText, onClick } = props;
  const ComponentIcon = valueType && IconMap[valueType];
  if (ComponentIcon) {
    return <ComponentIcon width={width} height={height} fill={fill} onClick={onClick} />;
  } 
  return null;
  
};
