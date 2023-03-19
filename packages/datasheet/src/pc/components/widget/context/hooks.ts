import { WidgetContext } from './widget_context';
import { useContext } from 'react';
import { widgetRenderTask } from './widget_render_task';
import { IWidgetRenderStatus, WidgetActionType } from './interface';
import { useMount } from 'ahooks';

export const useWidgetContext = () => {
  const context = useContext(WidgetContext);
  return context;
};

export const useManageWidgetRenderTask = (widgetId: string) => {
  const { state, dispatch } = useWidgetContext();
  useMount(() => {
    if (!state.widgetRenderMap[widgetId]) {
      dispatch({ type: WidgetActionType.SET_WIDGET_RENDER_STATUS, payload: { widgetId, status: IWidgetRenderStatus.None }});
      widgetRenderTask.addWidgetTask(widgetId, (widgetId: string, status: IWidgetRenderStatus) => {
        dispatch({ type: WidgetActionType.SET_WIDGET_RENDER_STATUS, payload: { widgetId, status }});
      });
    }
  });
};

export const useWidgetCanRender = (widgetId: string) => {
  const { state } = useWidgetContext();
  return state.widgetRenderMap[widgetId] !== IWidgetRenderStatus.None;
};