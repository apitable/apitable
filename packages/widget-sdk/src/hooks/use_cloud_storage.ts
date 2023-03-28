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

import { IWidgetContext } from 'interface';
import { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CloudStorage } from '../model/cloud_storage';
import { WidgetContext } from '../context';

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
 * 
 * @typeParam S default value.
 * @param key Key at storage.
 * @param initValue Initial default value, can be passed value or function, same principle as `useState` parameter.
 * @returns [value, setValue, editable] are [return value, setValue function, permission to write or not] respectively.
 * 
 * ### Example
 * ```js
 * import { useCloudStorage } from '@apitable/widget-sdk';
 *
 * // A simple counter
 * function Counter() {
 *   const [counter, setCounter, editable] = useCloudStorage('counter', 0);
 *   return (
 *     <div>
 *       Counter: {counter}
 *       <Button size="small" disable={!editable} onClick={() => setCounter(counter + 1)}>+</Button>
 *       <Button size="small" disable={!editable} onClick={() => setCounter(counter - 1)}>-</Button>
 *     </div>
 *   );
 * }
 * ```
 * 
 */
export function useCloudStorage<S>(key: string, initValue?: S | (() => S)): [S, Dispatch<SetStateAction<S>>, boolean] {
  const [_initValue] = useState(initValue);
  const { id } = useContext<IWidgetContext>(WidgetContext);
  const editable = useSelector(state => state.permission.storage.editable);
  const cloudStorageData = useSelector(state => state.widget?.snapshot.storage ?? null);
  // Bring up the value for caching to avoid components refresh due to storage changes.
  const storage = new CloudStorage(cloudStorageData, id);
  const value = storage.get(key) as any;

  return useMemo(() => {
    const storage = new CloudStorage(cloudStorageData, id);
    const setValue = (v?: any) => storage.set(key, v);
    return [storage.has(key) ? value : _initValue, setValue, editable];
  }, [cloudStorageData, id, value, _initValue, editable, key]);
}
