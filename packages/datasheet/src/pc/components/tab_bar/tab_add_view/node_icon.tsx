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
import { ConfigConstant } from '@apitable/core';
import { FormOutlined } from '@apitable/icons';
import { useThemeColors } from '@apitable/components';

const nodeIconMap = {
  [ConfigConstant.NodeType.FORM]: FormOutlined,
};

interface INodeIcon {
  nodeType: ConfigConstant.NodeType;
  size?: number;
  color?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

export const NodeIcon: React.FC<React.PropsWithChildren<INodeIcon>> = props => {
  const colors = useThemeColors();
  const { nodeType, size = 15, color = colors.thirdLevelText, onClick } = props;

  if (nodeType && nodeIconMap[nodeType]) {
    return React.createElement(nodeIconMap[nodeType], {
      size,
      color,
      onClick,
    });
  } 
  return <></>;
};
