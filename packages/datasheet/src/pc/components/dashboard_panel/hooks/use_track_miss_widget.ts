import { IReduxState, Selectors, StoreActions } from '@apitable/core';
import { usePrevious, useUpdateEffect } from 'ahooks';
import { difference } from 'lodash';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { store } from 'pc/store';
import { shallowEqual, useSelector } from 'react-redux';

export const useTrackMissWidgetAndDep = () => {
  const installedWidgetIds = useSelector(Selectors.getInstalledWidgetInDashboard)!;
  const dashboardId = useSelector(state => state.pageParams.dashboardId);
  const dispatch = useAppDispatch();
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
      /**
       * TODO: Identify the data requested from the dashboard so that when unMounting the dashboard and deleting the widget, 
       * the corresponding table data can also be deleted
       * */ 
      dispatch(StoreActions.resetWidget(reduceDiff));
    }

  }, [installedWidgetIds, previousInstalledIds, previousDashboardId, dashboardId]);
};
