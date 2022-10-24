import { colorVars } from '@vikadata/components';
import {
  MirrorArchitectureFilled,
  MirrorCalendarFilled,
  MirrorGalleryFilled,
  MirrorGanttFilled,
  MirrorGridFilled,
  MirrorKanbanFilled,
  MirrorOutlined,
} from '@vikadata/icons';
import { ViewType } from '@apitable/core';

export const gstMirrorIconByViewType = (viewType: ViewType, color: string = colorVars.thirdLevelText) => {
  switch (viewType) {
    case ViewType.Gallery: {
      return <MirrorGalleryFilled color={color} />;
    }
    case ViewType.Kanban: {
      return <MirrorKanbanFilled color={color} />;
    }
    case ViewType.Gantt: {
      return <MirrorGanttFilled color={color} />;
    }
    case ViewType.Grid: {
      return <MirrorGridFilled color={color} />;
    }
    case ViewType.Calendar: {
      return <MirrorCalendarFilled color={color} />;
    }
    case ViewType.OrgChart: {
      return <MirrorArchitectureFilled color={color} />;
    }
    default: {
      return <MirrorOutlined color={color} />;
    }
  }
};
