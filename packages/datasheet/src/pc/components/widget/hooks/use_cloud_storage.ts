import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CloudStorage } from '@vikadata/widget-sdk';
import { resourceService } from 'pc/resource_service';

/**
 * 小组件数据存储器。
 * 提供一个类似 `useState` 的接口存储, 通过一个指定的 key 来读写数据，多次设值数据会间隔 500ms 发送一次给协同者, key-value 键值对会被持久化的存储。
 * 当 value 变化的时候，会触发重新渲染，value 的变化可能来自于其他的协作者。
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
