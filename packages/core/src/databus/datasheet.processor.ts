import { IBaseDatasheetPack, IReduxState } from '../exports/store';
import { JsonDataProcessor } from './json_data_processor.abstractclass';
import { Record, DatasheetEventType, IDatasheetEventHandler, DataBus, IDatasheetEvent, ViewNotFoundError } from '.';
import { IRecordCreation } from './record.processor';
import { CollaCommandName, ICollaCommandOptions } from 'commands';
import { Store } from 'redux';

/**
 * When data changed, the type of filter that will be trigger
 */
export type DataChangedFilter = (data: Datasheet) => boolean;

export class Datasheet extends JsonDataProcessor<IBaseDatasheetPack> {
  private onDataChangedList: DataChangedFilter[];
  private _store: Store<IReduxState>;

  public constructor(dataSource: IBaseDatasheetPack, store: Store<IReduxState>) {
    super(dataSource);
    this._store = store;
  }

  /**
   * DataBus is a pure data processing library.
   * Any dependencies stuff use filter binding to do more.
   *
   * @param data
   * @returns
   */
  private doDataChangedFilter(): boolean {
    if (this.onDataChangedList != null && this.onDataChangedList.length > 0) {
      let result: boolean = true;

      for (const dataChangedHandler of this.onDataChangedList) {
        const r = dataChangedHandler(this);
        if (!r) {
          result = false;
        }
        // continue to do all filter
      }

      return result;
    }

    // default true pass
    return true;
  }

  public get id(): string {
    return this.getDataSource().datasheet.id;
  }

  public async addRecord(record: IRecordCreation): Promise<boolean> {
    this.doCommand({
      cmd: CollaCommandName.AddRecords,
      datasheetId: this.id,
      viewId: record.viewId,
      index: 0,
      count: 1,
      cellValues: record.cellValues ? [record.cellValues] : undefined,
      ignoreFieldPermission: true,
    });

    if (!this.doDataChangedFilter()) {
      // TODO rollback datasheet?
      return false;
    }

    return true;
  }

  public undo() {}

  public redo() {}

  public async doCommand(command: ICollaCommandOptions): Promise<void> {
    await DataBus.doCommand({
      datasheet: this,
      command,
    });
  }

  public createRecord() {}

  public calcRefFields() {}

  public updateRecord() {}
  public deleteRecord() {}

  public async getRecords(viewId: string): Promise<Record[]> {
    const snapshot = this.getDataSource().snapshot;
    const view = snapshot.meta.views.find(view => view.id === viewId);
    if (view === undefined) {
      throw new ViewNotFoundError(this.id, viewId);
    }
    return view.rows.map(row => {
      // TODO record not exist in recordMap is internal error, how do handle it ?
      return new Record(snapshot.recordMap[row.recordId]!)
    });
  }

  private _eventHandlers: Map<DatasheetEventType, Set<IDatasheetEventHandler>> = new Map();

  public addEventHandler<E extends DatasheetEventType>(handler: IDatasheetEventHandler & { type: E }): boolean {
    let handlers = this._eventHandlers.get(handler.type);
    if (handlers === undefined) {
      this._eventHandlers.set(handler.type, (handlers = new Set()));
    }
    if (handlers.has(handler)) {
      return false;
    } else {
      handlers.add(handler);
      return true;
    }
  }

  public removeEventHandler<E extends DatasheetEventType>(handler: IDatasheetEventHandler & { type: E }): boolean {
    let handlers = this._eventHandlers.get(handler.type);
    if (handlers === undefined) {
      this._eventHandlers.set(handler.type, (handlers = new Set()));
    }
    return handlers.delete(handler);
  }

  public removeEventHandlers<E extends DatasheetEventType>(kind: E): boolean {
    return this._eventHandlers.delete(kind);
  }

  public async fireEvent(event: IDatasheetEvent): Promise<void> {
    const handlers = this._eventHandlers.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        await handler.handle(event as any)
      }
    }
  }

  public get store(): Store<IReduxState> {
    return this._store;
  }

  public transform<T>(transformer: (options: IDatasheetTransformOptions) => Promise<T>): Promise<T> {
    return transformer({
      datasheetPack: this.getDataSource(),
      store: this._store,
    })
  }
}

export interface IDatasheetTransformOptions {
  datasheetPack: IBaseDatasheetPack;
  store: Store<IReduxState>
}

export interface IDatasheetOptions {
  store: Store<IReduxState> | ((dst: IBaseDatasheetPack) => Promise<Store<IReduxState>>)
}