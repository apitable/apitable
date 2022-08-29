import { IWidgetContext } from 'interface';
import { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CloudStorage } from '../model/cloud_storage';
import { WidgetContext } from '../context';
import { usePermission } from './private/use_permission';

/**
 * 小程序数据存储器。
 * 针对当前运行的小程序，提供一个类似 `useState` 的接口存储, 通过一个指定的 key 来读写数据，多次设值数据会间隔 500ms 发送一次给协同者, key-value 键值对会被持久化的存储。
 * 当 value 变化的时候，会触发重新渲染，value 的变化可能来自于其他的协作者，不建议在小程序首次安装时设置默认值，因为在多人协同的情况下初始默认值都是相同的，多次设置默
 * 认值会造成无意义的性能浪费甚至是死循环，应当在外部数据发生变化后对数据进行设置。
 * 
 * @typeParam S 默认值
 * @param key 存储时的 key 值
 * @param initValue 初始默认值, 可以传入值或者函数，原理与 `useState` 参数相同
 * @returns [value, setValue, editable] 分别为 [返回值，设置值方法、是否有权限写入]
 * 
 * ### 示例
 * ```js
 * import { useCloudStorage } from '@vikadata/widget-sdk';
 *
 * // 一个简单的计数器
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
  const { resourceService: datasheetService, id } = useContext<IWidgetContext>(WidgetContext);
  const editable = usePermission().storage.editable;
  const cloudStorageData = useSelector(state => state.widget?.snapshot.storage ?? null);
  // 将value提出来做缓存，避免 storage 变化引起组件刷新
  const storage = new CloudStorage(cloudStorageData, datasheetService, id);
  const value = storage.get(key) as any;

  return useMemo(() => {
    const storage = new CloudStorage(cloudStorageData, datasheetService, id);
    const setValue = v => storage.set(key, v);
    return [storage.has(key) ? value : _initValue, setValue, editable];
  }, [cloudStorageData, datasheetService, id, value, _initValue, editable, key]);
}
