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

  Api.getEmbedLinkInfo(embedId).then((res) => {
    const { success, data } = res.data;
    if (success) {
      // dispatch(StoreActions.setLoading(false));
      const { embedInfo, spaceId } = data;
      const { payload: embedSetting } = embedInfo;
      store.dispatch(StoreActions.setEmbedInfo({ ...embedSetting, spaceId }));
    } else {
      resourceService.instance!.destroy();
    }
  });

  resourceService.instance!.destroy();
  resourceService.instance!.init();

  memberStash.loadMemberList(embedId);
});
