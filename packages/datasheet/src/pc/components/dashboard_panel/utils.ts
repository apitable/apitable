import { batchActions } from 'redux-batched-actions';
import { StoreActions } from '@apitable/core';
import { store } from '../../store';
import { copyWidget, installToDashboard } from '../widget/widget_center/install_utils';
import { installedWidgetHandle } from '../widget/widget_panel/widget_panel_header';

export const createWidgetByExistWidgetId = (widgetId: string, dashboardId: string) => {
  return new Promise(async (resolve, reject) => {
    let widgets;

    try {
      widgets = await copyWidget(widgetId, dashboardId!);

      if (!widgets.length) {
        reject();
        return;
      }
      await installToDashboard(widgets[0], dashboardId!);
    } catch (e: any) {
      reject(e);
      return;
    }

    const _batchActions: any[] = [];

    widgets.forEach((item: any) => {
      _batchActions.push(StoreActions.receiveInstallationWidget(item.id, item));
    });

    store.dispatch(batchActions(_batchActions));

    installedWidgetHandle(widgets[widgets.length - 1].id);

    resolve(null);
  });
};
