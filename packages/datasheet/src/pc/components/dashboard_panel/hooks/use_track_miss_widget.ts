import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Selectors, StoreActions, IReduxState } from '@apitable/core';
import { usePrevious, useUpdateEffect } from 'ahooks';
import { difference } from 'lodash';
import { store } from 'pc/store';

export const useTrackMissWidgetAndDep = () => {
  const installedWidgetIds = useSelector(Selectors.getInstalledWidgetInDashboard)!;
  const dashboardId = useSelector(state => state.pageParams.dashboardId);
  const dispatch = useDispatch();
  const previousInstalledIds = usePrevious(installedWidgetIds)!;
  const previousDashboardId = usePrevious(dashboardId)!;

  useUpdateEffect(() => {
    if (previousDashboardId !== dashboardId) {
      return;
    }
    if (shallowEqual(installedWidgetIds, previousInstalledIds)) {
      return;
    }
    const increaseDiff = difference(installedWidgetIds, previousInstalledIds);
    const reduceDiff = difference(previousInstalledIds, installedWidgetIds);

    if (increaseDiff.length) {
      const state = store.getState();
      const diffWithWidgetMapIds = difference(increaseDiff, Object.keys(state.widgetMap)).filter(item => Boolean(item));

      if (!diffWithWidgetMapIds.length) {
        return;
      }

      dispatch(StoreActions.fetchWidgetsByWidgetIds(diffWithWidgetMapIds, ({ responseBody, getState }) => {
        const { data, success, message } = responseBody;

        if (success) {
          const state: IReduxState = getState();
          const datasheetMap = state.datasheetMap;
          const existDatasheetIds = Object.keys(datasheetMap);
          const datasheetIds = data.map(item => item.snapshot.datasheetId).filter(item => Boolean(item));
          const afterFilterRepeatIds: string[] = [...new Set(datasheetIds)] as string[];
          for (const id of afterFilterRepeatIds) {
            // 如果 DatasheetMap 中已经有相应的数表数据，则不进行重复的请求
            if (!existDatasheetIds.includes(id)) {
              dispatch(StoreActions.fetchDatasheet(id));
            }
          }

        } else {
          throw new Error(message);
        }
      }));
    }

    if (reduceDiff.length) {
      // TODO: 识别下是因为仪表盘请求出来的数据，这样在 unMount 仪表盘和删除 widget 时可以帮相应的数表数据也删除
      dispatch(StoreActions.resetWidget(reduceDiff));
    }

  }, [installedWidgetIds, previousInstalledIds, previousDashboardId, dashboardId]);
};
