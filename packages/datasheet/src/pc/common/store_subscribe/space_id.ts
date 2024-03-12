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

import { CacheManager, StoreActions } from '@apitable/core';
import { updateSubscription } from 'modules/billing';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';

let spaceId: string | null;

store.subscribe(function spaceIdChange() {
  const state = store.getState();
  const previousSpaceId = spaceId;
  spaceId = state.space.activeId;
  const shareId = state.pageParams.shareId;
  const embedId = state.pageParams.embedId;
  if (!spaceId || previousSpaceId === spaceId || shareId || embedId) {
    return;
  }

  // notify.reset(); // Toggle the space and reset the dom element positioned by toast
  console.log('init resourceService: ', spaceId);

  CacheManager.clear();
  resourceService.instance?.destroy();
  resourceService.instance?.init();
  // memberStash.loadMemberList(spaceId);

  store.dispatch(StoreActions.resetUnitInfo());
  // Request subscription information
  updateSubscription?.(spaceId);
});
