import { ResourceType } from '@apitable/core';
import { eqSet } from '@apitable/widget-sdk';
import { difference } from 'lodash';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

let mirrorIds: Set<string> = new Set();

store.subscribe(() => {
  const state = store.getState();
  const mirrorMap = state.mirrorMap;

  if (!mirrorMap || !resourceService.instance?.checkRoomExist()) {
    return;
  }
  const previousMirrorIds = mirrorIds;
  mirrorIds = new Set(Object.keys(mirrorMap).filter(item => Boolean(mirrorMap[item].mirror)));

  if (eqSet(mirrorIds, previousMirrorIds)) {
    return;
  }

  const diffOfAdd = difference([...mirrorIds], [...previousMirrorIds]);

  if (diffOfAdd.length) {
    for (const v of diffOfAdd) {
      resourceService.instance!.createCollaEngine(v, ResourceType.Mirror);
    }
  }
});
