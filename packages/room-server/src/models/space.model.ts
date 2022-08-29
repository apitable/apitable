
export class InternalSpaceSubscriptionView {
  maxRowsPerSheet: number; // 每张表允许的最大记录数
  maxRowsInSpace: number; // 当前空间站允许的最大记录数
  maxGalleryViewsInSpace: number; // 空间站内允许的相册视图的最大数量
  maxKanbanViewsInSpace: number; // 空间站内允许的看板视图的最大数量
  maxGanttViewsInSpace: number; // 空间站内允许的甘特视图的最大数量
  maxCalendarViewsInSpace: number; // 空间站内允许的日历视图的最大数量
}

export class InternalSpaceUsageView {
  recordNums: number; // 空间所有表总行数
  galleryViewNums: number; // 空间相册视图总数
  kanbanViewNums: number; // 空间看板视图总数
  ganttViewNums: number; // 空间甘特视图总数
  calendarViewNums: number; // 空间日历视图总数"
}

export class InternalCreateDatasheetVo{
  datasheetId: string;
  createdAt: number;
}