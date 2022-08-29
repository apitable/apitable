import { IDashboardSnapshot, IWidgetMap } from '@vikadata/core';
import { NodeInfo } from './node.model';

export class DashboardSnapshot {
  snapshot: IDashboardSnapshot;
}

export type DashboardData = NodeInfo & DashboardSnapshot;

export type WidgetMap = IWidgetMap;

export class DashboardDataPack {
  dashboard: DashboardData;
  widgetMap: WidgetMap;
}