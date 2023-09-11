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

import { difference } from 'lodash';
import { ResourceType } from '@apitable/core';
import { eqSet } from '@apitable/widget-sdk';
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
  mirrorIds = new Set(Object.keys(mirrorMap).filter((item) => Boolean(mirrorMap[item].mirror)));

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
