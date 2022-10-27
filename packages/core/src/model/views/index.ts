import { ViewType } from 'store';
import { DATASHEET_ID } from '../../config/dom_id';
import { CalendarView } from './calendar_view';
import { FormView } from './form_view';
import { GalleryView } from './gallery_view';
import { GridView } from './grid_view';
import { KanbanView } from './kanban_view';
import { GanttView } from './gantt_view';
import { NotSupportView } from './not_support_view';
import { View } from './views';
import { OrgChartView } from './org_chart_view';
export * from './org_chart_view';
export * from './calendar_view';
export * from './form_view';
export * from './gallery_view';
export * from './grid_view';
export * from './kanban_view';
export * from './gantt_view';
export * from './not_support_view';
export * from './views';

View.bindModel = (viewType: ViewType) => {
  const viewClass = getViewClass(viewType);
  return new viewClass();
};
export interface IBindViewModal {
  (viewType: ViewType.Kanban): KanbanView;
  (viewType: ViewType.Grid): GridView;
  (viewType: ViewType.Gallery): GalleryView;
  (viewType: ViewType.Calendar): CalendarView;
  (viewType: ViewType.Form): FormView;
  (viewType: ViewType.Gantt): GanttView;
  (viewType: ViewType.OrgChart): OrgChartView
  (viewType: ViewType.NotSupport): NotSupportView;
  (viewType: any): View;
}

export function getViewClass(viewType: ViewType) {
  switch (viewType) {
    case ViewType.Kanban:
      return KanbanView;
    case ViewType.Gallery:
      return GalleryView;
    case ViewType.Grid:
      return GridView;
    case ViewType.Form:
      return FormView;
    case ViewType.Calendar:
      return CalendarView;
    case ViewType.Gantt:
      return GanttView;
    case ViewType.OrgChart:
      return OrgChartView;
    default:
      return NotSupportView;
  }
}

// sensor custom attributes 
export function getViewAnalyticsId(viewType: ViewType) {
  switch (viewType) {
    case ViewType.Kanban:
      return DATASHEET_ID.VIEW_CREATOR_KANBAN;
    case ViewType.Gallery:
      return DATASHEET_ID.VIEW_CREATOR_GALLERY;
    case ViewType.Grid:
      return DATASHEET_ID.VIEW_CREATOR_GRID;
    case ViewType.Form:
      return DATASHEET_ID.VIEW_CREATOR_FORM;
    case ViewType.Calendar:
      return DATASHEET_ID.VIEW_CREATOR_CALENDAR;
    case ViewType.Gantt:
      return DATASHEET_ID.VIEW_CREATOR_GANTT;
    case ViewType.OrgChart:
      return DATASHEET_ID.VIEW_CREATOR_ORG_CHART;
    default:
      return '';
  }
}
