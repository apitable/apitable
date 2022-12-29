import { ViewType } from '@apitable/core';
import { useThemeColors } from '@apitable/components';
import * as React from 'react';
import GalleryIcon from 'static/icon/datasheet/view/datasheet_icon_gallery.svg';
import GridIcon from 'static/icon/datasheet/view/datasheet_icon_grid.svg';
import KanbanIcon from 'static/icon/datasheet/view/datasheet_icon_kanban.svg';
import CalendarIcon from 'static/icon/datasheet/view/datasheet_icon_calendar.svg';
import { ViewGanttOutlined, ViewArchitectureFilled } from '@apitable/icons';

const viewIconMap = {
  [ViewType.Grid]: GridIcon,
  [ViewType.Gallery]: GalleryIcon,
  [ViewType.Kanban]: KanbanIcon,
  [ViewType.Calendar]: CalendarIcon,
  [ViewType.Gantt]: ViewGanttOutlined,
  [ViewType.OrgChart]: ViewArchitectureFilled,
};

interface IViewIcon {
  viewType: ViewType;
  width?: number;
  height?: number;
  fill?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

export const ViewIcon: React.FC<IViewIcon> = props => {
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
