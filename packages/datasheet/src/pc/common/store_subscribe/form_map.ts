import { ResourceType } from '@apitable/core';
import { eqSet } from '@vikadata/widget-sdk';
import { difference } from 'lodash';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

let formIds: Set<string> = new Set();

store.subscribe(() => {
  const state = store.getState();
  const formMap = state.formMap;

  if (!formMap || !resourceService.instance?.checkRoomExist()) {
    return;
  }
  const previousFormIds = formIds;
  formIds = new Set(Object.keys(formMap).filter(item => Boolean(formMap[item].form)));
  if (eqSet(previousFormIds, formIds)) {
    return;
  }

  const diffOfAdd = difference([...formIds], [...previousFormIds]);

  if (diffOfAdd.length) {
    for (const v of diffOfAdd) {
      resourceService.instance!.createCollaEngine(v, ResourceType.Form);
    }
  }
});
