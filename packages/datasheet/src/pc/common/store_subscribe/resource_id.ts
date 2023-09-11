/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

export const t = () => {};
