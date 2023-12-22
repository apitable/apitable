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

import { CollaCommandManager, IResourceOpsCollect } from 'command_manager';
import { CommandExecutionResultType, IEventEmitter, IResourceEvent, IResourceEventHandler, ResourceEventType } from 'databus/common/event';
import { IReduxState } from 'exports/store/interfaces';
import { Store } from 'redux';
import { IDataStorageProvider, IStoreProvider } from '../providers';
import { Dashboard, IDashboardOptions } from './dashboard';
import { Datasheet, IDatasheetOptions } from './datasheet';

/**
 * A database is responsible for providing `Datasheet` instances.
 *
 * Conceptually, one database corresponds to one space in APITable.
 */
export class Database implements IEventEmitter {
  private storageProvider!: IDataStorageProvider;
  private readonly commandManagers: WeakMap<Store<IReduxState>, CollaCommandManager> = new WeakMap();
  private storeProvider!: IStoreProvider;

  /**
   * Set the data storage provider for the database.
   *
   * **NOTE**: A data storage provider must be set before loading datasheets.
   */
  setDataStorageProvider(provider: IDataStorageProvider): void {
    this.storageProvider = provider;
  }

  /**
   * Set the store provider that is responsible for providing internal redux stores for datasheets in this database.
   *
   * **NOTE**: A store provider must be set before loading datasheets.
   */
  setStoreProvider(provider: IStoreProvider) {
    this.storeProvider = provider;
  }

  /**
   * Load a datasheet in the database.
   *
   * **NOTE**: A data storage provider and a store provider must be set before loading datasheets.
   */
  async getDatasheet(dstId: string, options: IDatasheetOptions): Promise<Datasheet | null> {
    const { loadOptions } = options;
    const datasheetPack = await this.storageProvider.loadDatasheetPack(dstId, loadOptions);
    if (datasheetPack === null) {
      return null;
    }
    const store =
      'createStore' in options
        ? await options.createStore(datasheetPack)
        : await this.storeProvider.createDatasheetStore(datasheetPack, options.storeOptions);
    const datasheet = new Datasheet(dstId, {
      store,
      saver: this.storageProvider,
      commandManager: this.getCommandManager(store),
    });
    return datasheet;
  }

  async getDashboard(dsbId: string, options: IDashboardOptions): Promise<Dashboard | null> {
    const { loadOptions } = options;
    const dashboardPack = await this.storageProvider.loadDashboardPack(dsbId, loadOptions);
    if (dashboardPack === null) {
      return null;
    }
    const store =
      'createStore' in options
        ? await options.createStore(dashboardPack)
        : await this.storeProvider.createDashboardStore(dashboardPack, options.storeOptions);
    const dashboard = new Dashboard(dsbId, {
      store,
      saver: this.storageProvider,
      widgetMap: dashboardPack.widgetMap,
      commandManager: this.getCommandManager(store),
    });
    return dashboard;
  }

  private getCommandManager(store: Store<IReduxState>): CollaCommandManager {
    if (this.commandManagers.has(store)) {
      return this.commandManagers.get(store)!;
    }
    const commandManager = new CollaCommandManager(
      {
        handleCommandExecuted: (resourceOpCollections: IResourceOpsCollect[]) => {
          // FIXME should await
          void this.fireEvent({
            type: ResourceEventType.CommandExecuted,
            execResult: CommandExecutionResultType.Success,
            resourceOpCollections,
          });
        },
        handleCommandExecuteError: (error, errorType) => {
          // FIXME should await
          void this.fireEvent({
            type: ResourceEventType.CommandExecuted,
            execResult: CommandExecutionResultType.Error,
            error,
            errorType,
          });
        },
      },
      store,
    );
    this.commandManagers.set(store, commandManager);
    return commandManager;
  }

  private _eventHandlers: Map<ResourceEventType, Set<IResourceEventHandler>> = new Map();

  /**
   * Add an event handler to the database.
   *
   * @returns `true` if the event handler was successfully added. `false` if the same handler was previously added.
   */
  public addEventHandler(handler: IResourceEventHandler): boolean {
    let handlers = this._eventHandlers.get(handler.type);
    if (handlers === undefined) {
      handlers = new Set();
      this._eventHandlers.set(handler.type, handlers);
    }
    if (handlers.has(handler)) {
      return false;
    }
    handlers.add(handler);
    return true;
  }

  /**
   * Remove an event handler from the database.
   *
   * @returns `true` if the event handler was successfully removed. `false` if the handler did not exist in the datasheet.
   */
  public removeEventHandler(handler: IResourceEventHandler & { type: ResourceEventType }): boolean {
    let handlers = this._eventHandlers.get(handler.type);
    if (handlers === undefined) {
      handlers = new Set();
      this._eventHandlers.set(handler.type, handlers);
    }
    return handlers.delete(handler);
  }

  /**
   * Remove all event handles of a specific type from the database.
   */
  public removeEventHandlers(type: ResourceEventType): void {
    this._eventHandlers.delete(type);
  }

  /**
   * Fire an event in the database, invoking corresponding event handlers.
   */
  public async fireEvent(event: IResourceEvent): Promise<void> {
    const handlers = this._eventHandlers.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        await handler.handle(event as any);
      }
    }
  }
}
