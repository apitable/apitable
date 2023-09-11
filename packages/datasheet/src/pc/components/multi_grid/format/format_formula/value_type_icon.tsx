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
import { BasicValueType } from '@apitable/core';
import { NumberOutlined, CheckboxOutlined, TextOutlined, CalendarOutlined } from '@apitable/icons';

const IconMap = {
  [BasicValueType.Array]: TextOutlined,
  [BasicValueType.DateTime]: CalendarOutlined,
  [BasicValueType.Number]: NumberOutlined,
  [BasicValueType.String]: TextOutlined,
  [BasicValueType.Boolean]: CheckboxOutlined,
};

interface IViewIcon {
  valueType: BasicValueType;
  size?: number;
  fill?: string;
  onClick?: () => void;
}

export const ValueTypeIcon: React.FC<React.PropsWithChildren<IViewIcon>> = (props) => {
  const colors = useThemeColors();
  const { valueType, size = 16, fill = colors.thirdLevelText, onClick } = props;
  const ComponentIcon = valueType && IconMap[valueType];
  if (ComponentIcon) {
    return <ComponentIcon size={size} color={fill} onClick={onClick} />;
  }
  return null;
};
