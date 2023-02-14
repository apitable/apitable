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
import { useThemeColors } from '@apitable/components';
import FormIcon from 'static/icon/datasheet/toolbar_form.svg';

const nodeIconMap = {
  [ConfigConstant.NodeType.FORM]: FormIcon,
};

interface INodeIcon {
  nodeType: ConfigConstant.NodeType;
  width?: number;
  height?: number;
  fill?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

export const NodeIcon: React.FC<React.PropsWithChildren<INodeIcon>> = props => {
  const colors = useThemeColors();
  const { nodeType, width = 15, height = 15, fill = colors.thirdLevelText, onClick } = props;

  if (nodeType && nodeIconMap[nodeType]) {
    return React.createElement(nodeIconMap[nodeType], {
      width,
      height,
      fill,
      onClick,
    });
  } 
  return <></>;
};
