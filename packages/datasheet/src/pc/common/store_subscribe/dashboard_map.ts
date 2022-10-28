import { ResourceType } from '@apitable/core';
import { eqSet } from '@vikadata/widget-sdk';
import { difference } from 'lodash';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

let dashboardIds: Set<string> = new Set();

store.subscribe(() => {
  const state = store.getState();
  const dashboardMap = state.dashboardMap;

  if (!dashboardMap || !resourceService.instance?.checkRoomExist()) {
    return;
  }
  const previousDashboardIds = dashboardIds;
  dashboardIds = new Set(Object.keys(dashboardMap).filter(item => Boolean(dashboardMap[item].dashboard)));

  if (eqSet(dashboardIds, previousDashboardIds)) {
    return;
  }

  const diffOfAdd = difference([...dashboardIds], [...previousDashboardIds]);
  // If you want to delete a dashboard's data structure later, you can use the following variable judgement
  // const diffOfDelete = difference([...previousDashboardId], [...dashboardIds]);

  if (diffOfAdd.length) {
    for (const v of diffOfAdd) {
      resourceService.instance!.createCollaEngine(v, ResourceType.Dashboard);
    }
  }
});
