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

import {
  CollaCommandManager,
  ExecuteResult,
  ICollaCommandExecuteFailResult,
  ICollaCommandExecuteNoneResult,
  ICollaCommandExecuteSuccessResult,
} from 'command_manager';
import {
  CollaCommandName,
  IAddFieldOptions,
  IAddView,
  ICollaCommandOptions,
  IDeleteFieldData,
  IModifyView,
  IMoveView,
  ISetRecordOptions
} from 'commands';
import { IRecordMap, IReduxState, IServerDatasheetPack, ISnapshot, IViewProperty } from 'exports/store/interfaces';
import {
  getSnapshot,
  getDatasheet,
} from 'modules/database/store/selectors/resource/datasheet/base';
import { getResourceRevision } from 'modules/database/store/selectors/resource';
import { getStringifyCellValue,getViewById } from 'modules/database/store/selectors/resource/datasheet';

import { Store } from 'redux';
import { IField, ResourceType } from 'types';
import { Field } from './field';
import { IDataSaver, ILoadDatasheetPackOptions, ISaveOpsOptions, IStoreOptions } from '../providers';
import { IResource } from './resource.interface';
import { IAddRecordsOptions, IViewOptions, View } from './view';
import { applyJOTOperations } from 'modules/database/store/actions/resource';

interface IDatasheetCtorOptions {
  store: Store<IReduxState>;
  saver: IDataSaver;
  commandManager: CollaCommandManager;
}

export class Datasheet implements IResource {
  private readonly _commandManager: CollaCommandManager;
  private readonly store: Store<IReduxState>;
  private readonly saver: IDataSaver;

  public readonly type: ResourceType = ResourceType.Datasheet;

  /**
   * Create a `Datasheet` instance.
   *
   * @deprecated This constructor is not intended for public use.
   */
  public constructor(public readonly id: string, options: IDatasheetCtorOptions) {
    const { store, saver, commandManager } = options;
    this.store = store;
    this.saver = saver;
    this._commandManager = commandManager;
  }

  /**
   * The name of this datasheet.
   */
  public get name(): string {
    return getDatasheet(this.store.getState(), this.id)!.name;
  }

  /**
   * The snapshot data of this datasheet.
   */
  public get snapshot(): ISnapshot {
    return getSnapshot(this.store.getState(), this.id)!;
  }

  /**
   * The revision number of this datasheet.
   */
  public get revision(): number {
    return getResourceRevision(this.store.getState(), this.id, ResourceType.Datasheet)!;
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
   * TODO This is a temporary getter needed by front-end. All dependencies of CommandManager in the front-end will be removed in the future.
   *
   * @deprecated
   */
  get commandManager(): CollaCommandManager {
    return this._commandManager;
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
    if (saveOptions['prependOps'] && saveOptions['prependOps'].length > 0) {
      this.store.dispatch(applyJOTOperations(saveOptions['prependOps'], this.type, this.id));
    }
    const result = this._commandManager.execute<R>(command);
    if (result.result === ExecuteResult.Success) {
      const saveResult = await this.saver.saveOps(result.resourceOpsCollects, {
        ...saveOptions,
        resource: this,
        store: this.store,
      });
      result['saveResult'] = saveResult;
    }
    return result as ICommandExecutionResult<R>;
  }

  public async nestRoomChangeFromRust(roomId: string, data: any) {
    await this.saver.nestRoomChangeFromRust(roomId, data);
  }

  /**
   * Add records to the datasheet.
   *
   * @param recordOptions Options for adding records.
   * @param saveOptions The options that will be passed to the data saver.
   *
   * @return If the command execution succeeded, the `data` field of the return value is an array of IDs of newly created records.
   */
  public addRecords(recordOptions: IAddRecordsOptions & { viewId: string }, saveOptions: ISaveOptions): Promise<ICommandExecutionResult<string[]>> {
    return this.doCommand<string[]>(
      {
        cmd: CollaCommandName.AddRecords,
        viewId: recordOptions.viewId,
        index: recordOptions.index,
        count: recordOptions['count'] ?? recordOptions['recordValues'].length,
        cellValues: recordOptions['recordValues'],
        groupCellValues: recordOptions.groupCellValues,
        ignoreFieldPermission: recordOptions.ignoreFieldPermission,
        datasheetId: this.id,
      },
      saveOptions,
    );
  }

  /**
   * render the cell value
   *
   * @param fieldId datasheet field id
   * @param recordId datasheet record id
   *
   * @return cell stringify value
   */
  public cellValue(fieldId: string, recordId: string): string {
    return getStringifyCellValue(this.store.getState(), this.snapshot, recordId, fieldId);
  }

  /**
   * Update existing records in the datasheet.
   *
   * @param recordOptions Options for updating records.
   * @param saveOptions The options that will be passed to the data saver.
   */
  public updateRecords(recordOptions: ISetRecordOptions[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.doCommand<void>(
      {
        cmd: CollaCommandName.SetRecords,
        datasheetId: this.id,
        data: recordOptions,
      },
      saveOptions,
    );
  }

  public resetRecords(recordMap: IRecordMap, saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.doCommand<void>(
      {
        cmd: CollaCommandName.ResetRecords,
        datasheetId: this.id,
        data: recordMap,
        store: this.store,
      },
      saveOptions,
    );
  }

  /**
   * Delete records from the datasheet.
   *
   * @param recordIds Record IDs of records that will be deleted.
   * @param saveOptions The options that will be passed to the data saver.
   */
  public deleteRecords(recordIds: string[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.doCommand<void>(
      {
        cmd: CollaCommandName.DeleteRecords,
        data: recordIds,
      },
      saveOptions,
    );
  }

  /**
   * Add fields to the datasheet.
   *
   * @param fieldOptions Options for adding fields.
   * @param saveOptions The options that will be passed to the data saver.
   *
   * @return If the command execution succeeded, the `data` field of the return value is the ID of the newly created field.
   */
  public addFields(fieldOptions: IAddFieldOptions[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<string>> {
    return this.doCommand<string>(
      {
        cmd: CollaCommandName.AddFields,
        data: fieldOptions,
        datasheetId: this.id,
      },
      saveOptions,
    );
  }

  /**
   * Delete fields from the datasheet.
   *
   * @param fields Options for deleting fields.
   * @param saveOptions The options that will be passed to the data saver.
   */
  public deleteFields(fields: IDeleteFieldData[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.doCommand<void>(
      {
        cmd: CollaCommandName.DeleteField,
        data: fields,
        datasheetId: this.id,
      },
      saveOptions,
    );
  }

  /**
   * Update existing fields in the datasheet.
   *
   * @param field New field property.
   * @param saveOptions The options that will be passed to the data saver.
   */
  public updateField(field: IField, saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.doCommand<void>(
      {
        cmd: CollaCommandName.SetFieldAttr,
        fieldId: field.id,
        data: field,
        datasheetId: this.id,
      },
      saveOptions,
    );
  }

  /**
   * Add some views to the datasheet.
   *
   * @param views The properties of the views to be added.
   * @param saveOptions The options that will be passed to the data saver.
   */
  public addViews(views: IAddView[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.doCommand<void>(
      {
        cmd: CollaCommandName.AddViews,
        data: views,
      },
      saveOptions,
    );
  }

  /**
   * Delete some views from the datasheet.
   *
   * @param saveOptions The options that will be passed to the data saver.
   */
  public deleteViews(viewIds: string[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.doCommand<void>(
      {
        cmd: CollaCommandName.DeleteViews,
        data: viewIds.map(viewId => ({ viewId })),
      },
      saveOptions,
    );
  }

  /**
   * Modify view property.
   *
   * @param views view info
   * @param saveOptions The options that will be passed to the data saver.
   */
  public modifyViews(views: IModifyView[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.doCommand<void>(
      {
        cmd: CollaCommandName.ModifyViews,
        data: views,
      },
      saveOptions,
    );
  }

  /**
   * move view.
   *
   * @param views view info
   * @param saveOptions The options that will be passed to the data saver.
   */
  public moveViews(views: IMoveView[], saveOptions: ISaveOptions): Promise<ICommandExecutionResult<void>> {
    return this.doCommand<void>(
      {
        cmd: CollaCommandName.MoveViews,
        data: views,
      },
      saveOptions,
    );
  }

  /**
   * Get the first view of the datasheet.
   */
  public async getView(): Promise<View>;
  /**
   * Get the view specified by `id`.
   *
   * @returns If the view if not found, null is returned.
   */
  public async getView(id: string): Promise<View | null>;
  /**
   * Get the view specified by options.
   *
   * @returns If the view if not found, null is returned.
   */
  public async getView(options: IViewOptions): Promise<View | null>;

  public async getView(idOrOptions?: string | IViewOptions): Promise<View | null> {
    const state = this.store.getState();

    let viewId: string | undefined;
    if (typeof idOrOptions === 'string') {
      viewId = idOrOptions;
    } else if (idOrOptions && 'getViewInfo' in idOrOptions) {
      const { getViewInfo } = idOrOptions;
      const info = await getViewInfo(state);
      if (!info) {
        return null;
      }

      return new View(this, this.store, info);
    }

    const snapshot = getSnapshot(state, this.id);
    if (!snapshot) {
      return null;
    }

    let view: IViewProperty | undefined;
    if (viewId) {
      view = getViewById(snapshot, viewId);
      if (!view) {
        return null;
      }
    } else {
      view = snapshot.meta.views[0]!;
    }

    return new View(this, this.store, {
      property: view,
      fieldMap: snapshot.meta.fieldMap,
    });
  }
}

/**
 * The options for creating a `Database` instance. The implementor may extend this interface, adding necessary fields.
 */
export type IDatasheetOptions = IDatasheetDefaultOptions | IDatasheetOptionsWithCustomStore;

export interface IDatasheetDefaultOptions {
  storeOptions: IStoreOptions;
  loadOptions: ILoadDatasheetPackOptions;
}

export interface IDatasheetOptionsWithCustomStore {
  /**
   * Creates the internal redux store of the datasheet, overriding the store provider.
   */
  createStore: (dst: IServerDatasheetPack) => Promise<Store<IReduxState>> | Store<IReduxState>;

  loadOptions: ILoadDatasheetPackOptions;
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
export type ISaveOptions = Omit<ISaveOpsOptions, 'store' | 'resource'>;
