import { ICloudStorageData, ICloudStorageValue, IPermissionResult } from 'interface';
import { IResourceService } from 'resource';
import { CollaCommandName, ExecuteResult, ResourceType } from 'core';
import { cmdExecute } from 'iframe_message/utils';

/**
 * @hidden
 * CloudStorage is a simple KV storage center, and this class belongs to the underlying base method class.
 * 
 * Receive a string type key, value can be used to store object / number / string / null JSON type data.
 * 
 * When the get operation is performed, all collaborators get same data.
 * 
 * When the set operation is performed, all collaborators receive this data and 
 * update the view(if the view has dependencies on the corresponding data).
 * 
 * When the widget is deleted, the data in the corresponding CloudStorage is also deleted.
 * 
 * You can use {@link useCloudStorage}.
 * 
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
   * Check if the key exists in storage.
   * @param key 
   */
  has(key: string) {
    return this.storage && key in this.storage;
  } 
  /**
   * Get the value corresponding to the key value.
   *
   * Returns undefined if key dose not exist.
   *
   * @param key A string type key.
   * #### Example
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
   * Determine if you have permission to set cloudStorage.
   * 
   * Only users with edit permission can modify cloudStorage.
   *
   * #### Example
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
   * Set the value to the key passed in.
   * 
   * If the key setting fails, an error will be thrown.
   *
   * @param key A string type key.
   * @param value plain object / number / boolean / string / array / null JSON type data, if not passed, it means delete this.
   * #### Example
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
        // TODO: replace with toast
        alert('Operation execution failed');
      }
    });
  }
}
