export class InternalSpaceSubscriptionView {
  maxRowsPerSheet: number; // The maximum record allowed per datasheet
  maxRowsInSpace: number; // The maximum record allowed by the current space
  maxGalleryViewsInSpace: number; // The maximum number of gallery views allowed in the space
  maxKanbanViewsInSpace: number; // The maximum number of kanban views allowed in the space
  maxGanttViewsInSpace: number; // The maximum quantity of the allowable Gantt view in the space
  maxCalendarViewsInSpace: number; // The maximum number of calendar views allowed in the space
  canCallEnterpriseApi: boolean; // Is it possible to call enterprise-level APIs
}

export class InternalSpaceUsageView {
  recordNums: number; // The number of all records of all datasheets in the space
  galleryViewNums: number; // The number of all views in the space
  kanbanViewNums: number; // The number of all kanban views in the space
  ganttViewNums: number; // The number of all gantt views in the space
  calendarViewNums: number; // The number of all calender views in the space
}

export class InternalCreateDatasheetVo {
  datasheetId: string;
  createdAt: number;
}
