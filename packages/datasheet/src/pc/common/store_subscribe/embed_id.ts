import { Api, StoreActions } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { memberStash } from '../../../modules/space/member_stash/member_stash';

let embedId: string | undefined;

store.subscribe(function embedIdChange() {
  const previousEmbedId = embedId;
  const state = store.getState();
  embedId = state.pageParams.embedId;
  if (!embedId || previousEmbedId === embedId) {
    return;
  }
  console.log('init embedId: ', embedId);

  Api.getEmbedLinkInfo(embedId).then(res => {
    const { success, data } = res.data;
    if (success) {
      // dispatch(StoreActions.setLoading(false));
      const { 
        embedInfo, spaceId
      } = data;
      const {  
        payload: embedSetting, 
      } = embedInfo;
      store.dispatch(StoreActions.setEmbedInfo({ ...embedSetting, spaceId }));
    }
    resourceService.instance!.destroy();
    resourceService.instance!.init();

  });

  memberStash.loadMemberList(embedId);
});
