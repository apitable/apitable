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

import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { CollaCommandName, ResourceType } from '@apitable/core';
import { resourceService } from 'pc/resource_service';

import { useAppSelector } from 'pc/store/react-redux';

/**
 * Widget data storage.
 * For the currently running widget, provide a `useState` - like interface to store,
 * data is read and written by a specified key,
 * if you set the value multiple times the data will be sent to the collaborator at 500ms intervals,
 * key-value pairs are stored persistently.
 * When the value changes, re-render is triggered, changes in value may from other collaborator,
 * and it is not recommended to set default value when the widget first installed, because the initial default value
 * is the same of multiple collaborators. Setting defaults multiple times can result in pointless performance waste or event dead loops,
 * and data should be set up after changes in external data.
 */
export function useCloudStorage<S>(key: string, widgetId: string): [S, Dispatch<SetStateAction<S>>] {
  const [_initValue] = useState();
  const cloudStorageData = useAppSelector((state) => state.widgetMap[widgetId]?.widget?.snapshot.storage ?? null);

  return useMemo(() => {
    if (!resourceService.instance) {
      return ['', () => {}];
    }
    const value = cloudStorageData?.[key] as any;
    const setValue = (v: any) => {
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetGlobalStorage,
        key,
        value: v,
        resourceType: ResourceType.Widget,
        resourceId: widgetId,
      });
    };
    return [value || _initValue, setValue];
  }, [cloudStorageData, widgetId, key, _initValue]);
}
