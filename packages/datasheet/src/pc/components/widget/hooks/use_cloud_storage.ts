import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CloudStorage } from '@vikadata/widget-sdk';
import { resourceService } from 'pc/resource_service';

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
  const cloudStorageData = useSelector(state => state.widgetMap[widgetId]?.widget?.snapshot.storage ?? null);

  return useMemo(() => {
    if (!resourceService.instance) {
      return ['', () => {}];
    }
    const storage = new CloudStorage(cloudStorageData, resourceService.instance, widgetId);
    const value = storage.get(key) as any;
    const setValue = v => storage.set(key, v);
    return [value || _initValue, setValue];
  }, [cloudStorageData, widgetId, key, _initValue]);
}
