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

import { DatasheetEventType, CommandExecutionResultType, IEventEmitter } from '../common/event';
import { Field } from '.';
import { ILoadDatasheetPackOptions, ISaveOpsOptions } from '../providers';
import { Store } from 'redux';
import { IAddRecordsOptions, IViewOptions, View } from './view';
import { IResource } from './resource.interface';
import {
  CollaCommandManager,
  ExecuteResult,
  ICollaCommandExecuteFailResult,
  ICollaCommandExecuteNoneResult,
  ICollaCommandExecuteSuccessResult,
  IResourceOpsCollect,
} from 'command_manager';
import { IField, ResourceType } from 'types';
import { IBaseDatasheetPack, IReduxState, ISnapshot, Selectors } from 'exports/store';
import { CollaCommandName, IAddFieldOptions, ICollaCommandOptions, IDeleteFieldData, ISetRecordOptions } from 'commands';
import { IDataSaver } from '../providers/data.saver.interface';

export class Datasheet implements IResource {
  private readonly commandManager: CollaCommandManager;

  public readonly id: string;
  public readonly name: string;
  public readonly type: ResourceType = ResourceType.Datasheet;

  /**
   * Create a `Datasheet` instance from a datasheet pack and a store.
   *
   * @deprecated This constructor is not intended for public use.
   */
  public constructor(
    datasheetPack: IBaseDatasheetPack,
    private readonly store: Store<IReduxState>,
    private readonly saver: IDataSaver,
    eventEmitter: IEventEmitter,
  ) {
    this.id = datasheetPack.datasheet.id;
    this.name = datasheetPack.datasheet.name;
    this.commandManager = new CollaCommandManager(
      {
        handleCommandExecuted: (resourceOpCollections: IResourceOpsCollect[]) => {
          eventEmitter.fireEvent({
            type: DatasheetEventType.CommandExecuted,
            execResult: CommandExecutionResultType.Success,
            resourceOpCollections,
          });
        },
        handleCommandExecuteError: (error, errorType) => {
          eventEmitter.fireEvent({
            type: DatasheetEventType.CommandExecuted,
            execResult: CommandExecutionResultType.Error,
            error,
            errorType,
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

  public async addRecords(
    recordOptions: IAddRecordsOptions & { viewId: string },
    saveOptions: ISaveOptions,
  ): Promise<ICommandExecutionResult<string[]>> {
    return await this.doCommand<string[]>(
      {
        cmd: CollaCommandName.AddRecords,
        viewId: recordOptions.viewId,
        index: recordOptions.index,
        count: 'count' in recordOptions ? recordOptions.count : recordOptions.recordValues.length,
        cellValues: 'count' in recordOptions ? undefined : recordOptions.recordValues,
        groupCellValues: recordOptions.groupCellValues,
        ignoreFieldPermission: recordOptions.ignoreFieldPermission,
        datasheetId: this.id,
      },
      saveOptions,
    );
  }

  public async deleteRecords(recordIds: string[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return await this.doCommand<void>(
      {
        cmd: CollaCommandName.DeleteRecords,
        data: recordIds,
      },
      saveOptions,
    );
  }

  public async addFields(fieldOptions: IAddFieldOptions[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<string>> {
    return await this.doCommand<string>(
      {
        cmd: CollaCommandName.AddFields,
        data: fieldOptions,
        datasheetId: this.id,
      },
      saveOptions,
    );
  }

  public async deleteFields(fields: IDeleteFieldData[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return await this.doCommand<void>(
      {
        cmd: CollaCommandName.DeleteField,
        data: fields,
        datasheetId: this.id,
      },
      saveOptions,
    );
  }

  public async updateField(field: IField, saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return await this.doCommand<void>(
      {
        cmd: CollaCommandName.SetFieldAttr,
        fieldId: field.id,
        data: field,
        datasheetId: this.id,
      },
      saveOptions,
    );
  }

  public async updateCells(cells: ISetRecordOptions[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return await this.doCommand<void>(
      {
        cmd: CollaCommandName.SetRecords,
        data: cells,
        datasheetId: this.id,
      },
      saveOptions,
    );
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
