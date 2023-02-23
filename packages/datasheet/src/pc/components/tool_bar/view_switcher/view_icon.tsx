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

import { ViewType } from '@apitable/core';
import { useThemeColors } from '@apitable/components';
import * as React from 'react';
import GalleryIcon from 'static/icon/datasheet/view/datasheet_icon_gallery.svg';
import GridIcon from 'static/icon/datasheet/view/datasheet_icon_grid.svg';
import KanbanIcon from 'static/icon/datasheet/view/datasheet_icon_kanban.svg';
import CalendarIcon from 'static/icon/datasheet/view/datasheet_icon_calendar.svg';
import { GanttOutlined, ArchitectureOutlined } from '@apitable/icons';

const viewIconMap = {
  [ViewType.Grid]: GridIcon,
  [ViewType.Gallery]: GalleryIcon,
  [ViewType.Kanban]: KanbanIcon,
  [ViewType.Calendar]: CalendarIcon,
  [ViewType.Gantt]: GanttOutlined,
  [ViewType.OrgChart]: ArchitectureOutlined,
};

interface IViewIcon {
  viewType: ViewType;
  width?: number;
  height?: number;
  fill?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

export const ViewIcon: React.FC<React.PropsWithChildren<IViewIcon>> = props => {
  const colors = useThemeColors();
  const { viewType, width = 15, height = 15, fill = colors.thirdLevelText, onClick } = props;

  if (viewType && viewIconMap[viewType]) {
    return React.createElement(viewIconMap[viewType], {
      width,
      height,
      fill,
      color: fill,
      onClick,
    });
  } 
  return <></>;

};
