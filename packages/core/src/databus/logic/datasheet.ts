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

import { DatasheetEventType, IDatasheetEventHandler, IDatasheetEvent, ILoadDatasheetPackOptions, Field } from '.';
import { Store } from 'redux';
import { IViewOptions, View } from './view';
import { IResource } from './resource.interface';
import {
  CollaCommandManager,
  ExecuteResult,
  ICollaCommandExecuteFailResult,
  ICollaCommandExecuteNoneResult,
  ICollaCommandExecuteSuccessResult,
  IResourceOpsCollect,
} from 'command_manager';
import { ResourceType } from 'types';
import { IBaseDatasheetPack, IReduxState, ISnapshot, Selectors } from 'exports/store';
import { ICollaCommandOptions } from 'commands';
import { IDataSaver, ISaveOpsOptions } from './data.saver.interface';

export class Datasheet implements IResource {
  private commandManager: CollaCommandManager;

  public readonly id: string;
  public readonly name: string;
  public readonly type: ResourceType = ResourceType.Datasheet;

  /**
   * Create a `Datasheet` instance from a datasheet pack and a store.
   *
   * @deprecated This constructor is not intended for public use.
   */
  public constructor(datasheetPack: IBaseDatasheetPack, private readonly store: Store<IReduxState>, private readonly saver: IDataSaver) {
    this.id = datasheetPack.datasheet.id;
    this.name = datasheetPack.datasheet.name;
    this.commandManager = new CollaCommandManager(
      {
        handleCommandExecuted: (resourceOpCollections: IResourceOpsCollect[]) => {
          this.fireEvent({
            type: DatasheetEventType.CommandExecuted,
            resourceOpCollections,
          });
        },
        handleCommandExecuteError: (error, _type) => {
          this.fireEvent({
            type: DatasheetEventType.CommandExecuted,
            error,
          });
        },
      },
      store,
    );
  }

  /**
   * The snapshot data of this datasheet.
   */
  public get snapshot(): ISnapshot {
    return Selectors.getSnapshot(this.store.getState(), this.id)!;
  }

  /**
   * The revision number of this datasheet.
   */
  public get revision(): number {
    return Selectors.getResourceRevision(this.store.getState(), this.id, ResourceType.Datasheet)!;
  }

  /**
   * A map of all fields in the datasheet, including fields hidden in some views.
   */
  public get fields(): { [fieldId: string]: Field } {
    const { fieldMap } = this.snapshot.meta;
    const fields: { [fieldId: string]: Field } = {};
    for (const fieldId in fieldMap) {
      fields[fieldId] = new Field(fieldMap[fieldId]!, this.store);
    }
    return fields;
  }

  /**
   * Perform a command on this datasheet.
   *
   * @param command The command that will be executed.
   * @param saveOptions The options that will be passed to the data saver.
   * 
   * @deprecated This method is not intended for public use.
   */
  public async doCommand<R>(command: ICollaCommandOptions, saveOptions: ISaveOptions): Promise<ICommandExecutionResult<R>> {
    const result = this.commandManager.execute<R>(command);
    if (result.result === ExecuteResult.Success) {
      const saveResult = await this.saver.saveOps(result.resourceOpsCollects, {
        ...saveOptions,
        datasheet: this,
        store: this.store,
      });
      result['saveResult'] = saveResult;
    }
    return result as ICommandExecutionResult<R>;
  }

  /**
   * Get the view whose property is given by `options.getViewInfo`. If the view is not found, `null` is returned.
   */
  public async getView(options: IViewOptions): Promise<View | null> {
    const { getViewInfo } = options;
    const state = this.store.getState();

    const info = await getViewInfo(state);
    if (!info) {
      return Promise.resolve(null);
    }

    return Promise.resolve(new View(this, this.store, info));
  }

  private _eventHandlers: Map<DatasheetEventType, Set<IDatasheetEventHandler>> = new Map();

  /**
   * Add an event handler to the datasheet.
   *
   * @returns `true` if the event handler was successfully added. `false` if the same handler was previously added.
   */
  public addEventHandler(handler: IDatasheetEventHandler): boolean {
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
   * Remove an event handler from the datasheet.
   *
   * @returns `true` if the event handler was successfully removed. `false` if the handler did not exist in the datasheet.
   */
  public removeEventHandler(handler: IDatasheetEventHandler & { type: DatasheetEventType }): boolean {
    let handlers = this._eventHandlers.get(handler.type);
    if (handlers === undefined) {
      handlers = new Set();
      this._eventHandlers.set(handler.type, handlers);
    }
    return handlers.delete(handler);
  }

  /**
   * Remove all event handles of a specific type from the datasheet.
   */
  public removeEventHandlers(type: DatasheetEventType): void {
    this._eventHandlers.delete(type);
  }

  /**
   * Fire an event in the datasheet, invoking corresponding event handlers. The data saver will be invoked
   * if the event is a CommandExecuted event. The data save is always invoked before all event handlers.
   */
  public async fireEvent(event: IDatasheetEvent): Promise<void> {
    const handlers = this._eventHandlers.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        await handler.handle(event as any);
      }
    }
  }
}

/**
 * The options for creating a `Database` instance. The implementor may extend this interface, adding necessary fields.
 */
export interface IDatasheetOptions extends ILoadDatasheetPackOptions {
  /**
   * Creates the internal redux store of the datasheet, overriding the store provider.
   */
  createStore?: (dst: IBaseDatasheetPack) => Promise<Store<IReduxState>>;
}

export type ICommandExecutionResult<R> = ICommandExecutionSuccessResult<R> | ICollaCommandExecuteNoneResult | ICollaCommandExecuteFailResult;

export interface ICommandExecutionSuccessResult<R> extends ICollaCommandExecuteSuccessResult<R> {
  /**
   * The return value of the data loader.
   */
  saveResult: any;
}

/**
 * The options for the data loader.
 */
export type ISaveOptions = Omit<ISaveOpsOptions, 'store' | 'datasheet'>;
