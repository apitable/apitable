import { Api, StoreActions } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { memberStash } from '../member_stash/member_stash';

let shareId: string | undefined;

store.subscribe(function shareIdChange() {
  const previousShareId = shareId;
  const state = store.getState();
  shareId = state.pageParams.shareId;
  if (!shareId || previousShareId === shareId) {
    return;
  }
  console.log('init shareId: ', shareId);

  Api.readShareInfo(shareId).then(res => {
    const { success, data } = res.data;
    if (success) {
      store.dispatch(StoreActions.setShareInfo({
        spaceId: data.spaceId,
      }));
    }
    resourceService.instance!.destroy();
    resourceService.instance!.init();
  });

  memberStash.loadMemberList(shareId);
});
