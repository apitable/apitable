import { StoreActions, CacheManager } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { memberStash } from '../../../modules/space/member_stash/member_stash';
// @ts-ignore
import { getBillingInfo } from 'enterprise';

let spaceId: string | null;

store.subscribe(function spaceIdChange() {
  const state = store.getState();
  const previousSpaceId = spaceId;
  spaceId = state.space.activeId;
  const shareId = state.pageParams.shareId;

  if (!spaceId || previousSpaceId === spaceId || shareId) {
    return;
  }

  // notify.reset(); // Toggle the space and reset the dom element positioned by toast
  console.log('init resourceService: ', spaceId);

  CacheManager.clear();
  resourceService.instance?.destroy();
  resourceService.instance?.init();
  memberStash.loadMemberList(spaceId);

  store.dispatch(StoreActions.resetUnitInfo());
  // Request subscription information
  getBillingInfo?.(spaceId).then(data => {
    store.dispatch(StoreActions.updateSubscription(data));
  });
});

