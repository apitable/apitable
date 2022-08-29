import { ResourceType } from '@vikadata/core';
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
  // 如果以后要删除 dashboard 的数据结构，可以使用下面的变量判断
  // const diffOfDelete = difference([...previousDashboardId], [...dashboardIds]);

  if (diffOfAdd.length) {
    for (const v of diffOfAdd) {
      resourceService.instance!.createCollaEngine(v, ResourceType.Dashboard);
    }
  }
});
