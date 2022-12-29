// import { store } from 'pc/store';
// import { dashboardIdChange } from './dashboard_id';
// import { datasheetIdChange } from './datasheet_id';

// let resourceId: string | undefined;

// store.subscribe(() => {
//   const previousResourceId = resourceId;
//   const state = store.getState();
//   resourceId = state.pageParams.resourceId;

//   if (!resourceId || previousResourceId === resourceId) {
//     return;
//   }

//   if (/(dst\w+)/.test(resourceId)) {
//     datasheetIdChange(resourceId, previousResourceId);
//   }else if (/(dsb\w+)/.test(resourceId)) {
//     dashboardIdChange(resourceId, previousResourceId);
//   }

//   // const widgetPanelStatusMap = getStorage(StorageName.WidgetPanelStatusMap);
//   // if (widgetPanelStatusMap) {
//   //   const widgetPanelStatus = widgetPanelStatusMap[`${spaceId},${resourceId}`];
//   //   if (widgetPanelStatus) {
//   //     store.dispatch(
//   //       batchActions([
//   //         StoreActions.toggleWidgetPanel(resourceId, widgetPanelStatus.opening),
//   //         StoreActions.changeWidgetPanelWidth(widgetPanelStatus.width, resourceId),
//   //       ])
//   //     );
//   //   }
//   // }

//   // resourceService.instance!.switchRoom({
//   //   from: previousResourceId, to: resourceId, resourceType: ResourceType.Datasheet,
//   // });
// });

export const t = () => { };

