import { StoreActions, CacheManager } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { memberStash } from '../member_stash/member_stash';
import { getBillingInfo } from '../billing';

let spaceId: string | null;

store.subscribe(function spaceIdChange() {
  const state = store.getState();
  const previousSpaceId = spaceId;
  spaceId = state.space.activeId;
  const shareId = state.pageParams.shareId;

  if (!spaceId || previousSpaceId === spaceId || shareId) {
    return;
  }

  // notify.reset(); // 切换空间，重置 toast 的定位的 dom 元素
  console.log('init resourceService: ', spaceId);

  CacheManager.clear();
  resourceService.instance?.destroy();
  resourceService.instance?.init();
  memberStash.loadMemberList(spaceId);

  store.dispatch(StoreActions.resetUnitInfo());
  // 请求订阅信息
  getBillingInfo(spaceId).then(data => {
    store.dispatch(StoreActions.updateSubscription(data));
  });
});

