import { CollaCommandName, ExecuteResult, IWidget, ResourceType, StoreActions } from '@apitable/core';
import { widgetApi } from 'api/index';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

export const installWidget = (widgetPackageId: string, nodeId: string, name?: string) => {
  return new Promise<IWidget>(async (resolve, reject) => {
    try {
      const res = await widgetApi.installWidget(nodeId, widgetPackageId, name);
      const { data, success } = res.data;
      if (success) {
        resolve(data);
      }
    } catch (e) {
      reject();
    }
  });
};

export const copyWidget = (widgetId: string, resourceId: string): Promise<IWidget[]> => {
  return new Promise<IWidget[]>(async (resolve, reject) => {
    const res = await widgetApi.copyWidgetsToNode(resourceId, [widgetId]);
    const { data, success, message } = res.data;
    if (success) {
      resolve(data);
    }
    reject(message);
  });
};

export const installToPanel = (data: IWidget, resourceId: string, resourceType: ResourceType.Mirror | ResourceType.Datasheet) => {
  return new Promise<void>((resolve, reject) => {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddWidgetToPanel,
      resourceId: resourceId!,
      resourceType: resourceType,
      widgetId: data.id,
    });
    if (result.result === ExecuteResult.Success) {
      store.dispatch(StoreActions.receiveInstallationWidget(data.id, data));
      resolve();
    }
    reject();
  });
};

export const installToDashboard = (data: IWidget, dashboardId: string) => {
  return new Promise<void>((resolve, reject) => {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddWidgetToDashboard,
      dashboardId,
      widgetIds: [data.id],
      cols: 12,
    });

    if (result.result === ExecuteResult.Success) {
      store.dispatch(StoreActions.receiveInstallationWidget(data.id, data));
      resolve();
    }
    reject();
  });
};
