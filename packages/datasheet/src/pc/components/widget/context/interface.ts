export enum IWidgetRenderStatus {
  None = 'None',
  Loading = 'Loading',
  Finish = 'Finish',
}

type IWidgetRenderMap = { [widgetId: string]: IWidgetRenderStatus };

export interface IWidgetContext {
  widgetRenderMap: IWidgetRenderMap;
}

export enum WidgetActionType {
  SET_WIDGET_RENDER_STATUS = 'SET_WIDGET_RENDER_STATUS',
}
