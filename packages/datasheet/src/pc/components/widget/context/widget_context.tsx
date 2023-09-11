import { useUnmount } from 'ahooks';
import produce from 'immer';
import { createContext, ReactChild, ReactFragment, ReactPortal, useReducer } from 'react';
import { IWidgetContext, WidgetActionType } from './interface';
import { widgetRenderTask } from './widget_render_task';

const initState = {
  widgetRenderMap: {},
};

export const WidgetContext = createContext<{
  state: IWidgetContext;
  dispatch: React.Dispatch<any>;
}>({ state: initState, dispatch: () => {} });

const reducer = (state: IWidgetContext, action: any) => {
  switch (action.type) {
    case WidgetActionType.SET_WIDGET_RENDER_STATUS:
      return produce(state, (draft) => {
        draft.widgetRenderMap[action.payload.widgetId] = action.payload.status;
      });
    default:
      throw new Error('error action type');
  }
};

export const WidgetContextProvider = (props: { children: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  useUnmount(() => {
    // Empty the rendering task queue every time the applet global context is unloaded.
    widgetRenderTask.clearTask();
  });
  return <WidgetContext.Provider value={{ state, dispatch }}>{props.children}</WidgetContext.Provider>;
};
