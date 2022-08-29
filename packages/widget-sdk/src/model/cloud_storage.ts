import { ICloudStorageData, ICloudStorageValue, IPermissionResult } from 'interface';
import { IResourceService } from 'resource';
import { CollaCommandName, ExecuteResult, ResourceType } from 'core';
import { cmdExecute } from 'iframe_message/utils';

/**
 * @hidden
 * CloudStorage 是一个简单的 KV 存储中心, 该类属于底层基础方法类。
 * 
 * 接收一个 string 类型的 key, value 可以用来存放 plain object / number / string / null JSON 类型的数据。
 * 
 * 当执行 get 操作的时候，所有协作者拿到的数据都是一样的。
 * 
 * 当执行 set 操作的时候，所有协作者都会收到这份数据，并更新视图（如果视图有依赖对应数据的话）。
 * 
 * 当小程序被删除的时候，对应的 CloudStorage 中数据也会被删除。
 * 
 * 可以使用 {@link useCloudStorage} 
 */
export class CloudStorage {
  /**
   * @hidden
   */
  constructor(
    private storage: ICloudStorageData,
    private resourceService: IResourceService,
    private widgetId: string
  ) { }

  /**
   * 检查 key 是否存在于 storage 中
   * @param key 
   */
  has(key: string) {
    return this.storage && key in this.storage;
  } 
  /**
   * 获取 key 值对应的 value
   *
   * 如果 key 值不存在则返回 undefined
   *
   * @param key 一个 string 类型的 key 值
   * #### 示例
   * ```js
   *
   * const value = cloudStorage.get('topLevelKey');
   * ```
   */
  get<T extends ICloudStorageValue>(key: string): T | undefined {
    if (!this.storage) return;
    return this.storage[key] as T;
  }

  /**
   * 判断是否有权限设置 cloudStorage
   * 
   * 拥有编辑权限的用户才可以修改 cloudStorage
   *
   * #### 示例
   * ```js
   * // Check if user can update a specific key and value.
   * const canSetFavoriteColor = cloudStorage.hasPermissionToSet();
   * if (!canSetFavoriteColor.acceptable) {
   *   alert(canSetFavoriteColor.message);
   * }
   * ```
   */
  hasPermissionToSet(): IPermissionResult {
    return { acceptable: true };
  }

  /**
   * 给传入的 key 设置 value
   * 
   * 如果 key 设置失败，则会抛出错误
   *
   * @param key 一个 string 类型的 key 值
   * @param value plain object / number / boolean / string / array / null JSON 类型的数据，如果不传，则代表删除这个 key
   * #### 示例
   * ```js
   *
   * async function updateFavoriteColorIfPossibleAsync(color) {
   *     if (cloudStorage.hasPermissionToSet()) {
   *         await cloudStorage.setAsync('favoriteColor', color);
   *     }
   *     // cloudStorage updates have been saved to vika servers.
   *     alert('favoriteColor has been updated');
   * }
   * ```
   */
  set(key: string, value?: ICloudStorageValue): void {
    cmdExecute({
      cmd: CollaCommandName.SetGlobalStorage,
      key,
      value,
      resourceType: ResourceType.Widget,
      resourceId: this.widgetId,
    }, this.resourceService).then(result => {
      if (result.result !== ExecuteResult.Success) {
        // 换成 toast
        alert('操作执行失败');
      }
    });
  }
}
