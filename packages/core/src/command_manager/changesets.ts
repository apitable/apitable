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

import { IResourceOpsCollect } from 'command_manager';
import { ILocalChangeset } from 'engine';
import { IReduxState, Selectors } from 'exports/store';
import { generateRandomString } from 'utils';

export function resourceOpsToChangesets(resourceOpsCollects: IResourceOpsCollect[], state: IReduxState): ILocalChangeset[] {
  const changesetMap: Map<string, ILocalChangeset> = new Map();
  resourceOpsCollects.forEach(collect => {
    const { resourceId, resourceType, operations } = collect;
    // One datasheet, one changeset
    let changeset = changesetMap.get(resourceId);
    if (!changeset) {
      const datasheet = Selectors.getDatasheet(state, resourceId);
      changesetMap.set(
        resourceId,
        (changeset = {
          baseRevision: datasheet!.revision,
          messageId: generateRandomString(),
          resourceId,
          resourceType,
          operations,
        }),
      );
    } else {
      changeset.operations.push(...operations);
    }
  });
  return [...changesetMap.values()];
}
