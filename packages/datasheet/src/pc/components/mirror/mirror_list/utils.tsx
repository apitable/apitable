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

import { colorVars } from '@apitable/components';
import { ViewType } from '@apitable/core';
import {
  ArchitectureMirrorOutlined,
  CalendarMirrorOutlined,
  GalleryMirrorOutlined,
  GanttMirrorOutlined,
  GridMirrorOutlined,
  KanbanMirrorOutlined,
  MirrorOutlined,
} from '@apitable/icons';

export const gstMirrorIconByViewType = (viewType: ViewType, color: string = colorVars.thirdLevelText) => {
  switch (viewType) {
    case ViewType.Gallery: {
      return <GalleryMirrorOutlined color={color} />;
    }
    case ViewType.Kanban: {
      return <KanbanMirrorOutlined color={color} />;
    }
    case ViewType.Gantt: {
      return <GanttMirrorOutlined color={color} />;
    }
    case ViewType.Grid: {
      return <GridMirrorOutlined color={color} />;
    }
    case ViewType.Calendar: {
      return <CalendarMirrorOutlined color={color} />;
    }
    case ViewType.OrgChart: {
      return <ArchitectureMirrorOutlined color={color} />;
    }
    default: {
      return <MirrorOutlined color={color} />;
    }
  }
};
