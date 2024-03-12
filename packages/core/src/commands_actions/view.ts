import { IJOTAction, OTActionName } from '../engine/ot/interface';
import {
  ICalendarViewProperty,
  ISetCalendarStyle,
  ISnapshot,
} from '../exports/store/interfaces';
import { ViewType } from 'modules/shared/store/constants';
import { getViewIndex } from 'modules/database/store/selectors/resource/datasheet/calc';
import { IGalleryViewProperty,
  IGanttViewProperty,
  IKanbanViewProperty, IOrgChartViewProperty,
  ISetGalleryStyle, ISetGanttStyle, ISetKanbanStyleValue, ISetOrgChartStyle } from '../exports/store/interfaces';
export class ViewAction {

  /**
   * gallery view UI setting
   */
  static setGalleryStyle2Action = (
    snapshot: ISnapshot,
    payload: ISetGalleryStyle,
  ): IJOTAction | null => {
    const { viewId, styleKey, styleValue } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IGalleryViewProperty;
    if (view.type !== ViewType.Gallery || styleValue === view.style[styleKey]) {
      return null;
    }
    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'style', styleKey],
      oi: styleValue,
      od: view.style[styleKey],
    };
  };

  static setCalendarStyle2Action = (snapshot: ISnapshot, payload: { viewId: string, data: ISetCalendarStyle[], isClear?: boolean }): IJOTAction[] => {
    const { viewId, data, isClear } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) return [];
    const view = snapshot.meta.views[viewIndex] as ICalendarViewProperty;
    if (view.type !== ViewType.Calendar) return [];

    return data.filter(({ styleKey, styleValue }) => {
      return styleValue !== view.style[styleKey];
    }).map(({ styleKey, styleValue }) => {
      if (isClear) {
        return {
          n: OTActionName.ObjectDelete,
          p: ['meta', 'views', viewIndex, 'style', styleKey],
          od: view.style[styleKey],
        };
      }
      return {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', viewIndex, 'style', styleKey],
        oi: styleValue,
        od: view.style[styleKey],
      };
    });
  };

  static setViewStyle2Action = (
    snapshot: ISnapshot,
    payload: ISetKanbanStyleValue & { viewId: string },
  ): IJOTAction | null => {
    const { viewId, styleKey, styleValue } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IKanbanViewProperty;
    if (view.type !== ViewType.Kanban || styleValue === view.style[styleKey]) {
      return null;
    }

    if (styleValue == null) {
      return {
        n: OTActionName.ObjectDelete,
        p: ['meta', 'views', viewIndex, 'style', styleKey],
        od: view.style[styleKey],
      };
    }

    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'style', styleKey],
      oi: styleValue,
      od: view.style[styleKey],
    };
  };

  static setOrgChartStyle2Action = (
    snapshot: ISnapshot,
    payload: ISetOrgChartStyle,
  ): IJOTAction | null => {
    const { viewId, styleKey, styleValue } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IOrgChartViewProperty;
    if (view.type !== ViewType.OrgChart || styleValue === view.style[styleKey]) {
      return null;
    }
    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'style', styleKey],
      oi: styleValue,
      od: view.style[styleKey],
    };
  };

  static setGanttStyle2Action = (snapshot: ISnapshot, payload: { viewId: string, data: ISetGanttStyle[] }): IJOTAction[] => {
    const { viewId, data } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) return [];
    const view = snapshot.meta.views[viewIndex] as IGanttViewProperty;
    if (view.type !== ViewType.Gantt) return [];

    return data.filter(({ styleKey, styleValue }) => {
      return styleValue !== view.style[styleKey];
    }).map(({ styleKey, styleValue }) => {
      return {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', viewIndex, 'style', styleKey],
        oi: styleValue,
        od: view.style[styleKey],
      };
    });
  };
}