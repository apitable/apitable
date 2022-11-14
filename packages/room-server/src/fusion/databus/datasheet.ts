import {
  IBaseDatasheetPack,
  IReduxState,
  ICollaCommandOptions,
  CollaCommandManager,
  IResourceOpsCollect,
  ResourceType,
  ICollaCommandExecuteSuccessResult,
  ICollaCommandExecuteFailResult,
  ICollaCommandExecuteNoneResult,
  ExecuteResult,
  ISnapshot,
} from '@apitable/core';
import { DatasheetEventType, IDatasheetEventHandler, IDatasheetEvent, ILoadDatasheetPackOptions } from '.';
import { Store } from 'redux';
import { IViewOptions, View } from './view';
import { IResource } from './resource.interface';

export class Datasheet implements IResource {
  private commandManager: CollaCommandManager;

  public readonly id: string;
  public readonly type: ResourceType = ResourceType.Datasheet;

  private commandResultExtra: any;

  public constructor(private readonly datasheetPack: IBaseDatasheetPack, private readonly store: Store<IReduxState>) {
    this.id = datasheetPack.datasheet.id;
    this.commandManager = new CollaCommandManager(
      {
        handleCommandExecuted: (collectedResourceOps: IResourceOpsCollect[]) => {
          this.fireEvent({
            type: DatasheetEventType.CommandExecuted,
            store: this.store,
            collectedResourceOps,
            setExtra: extra => {
              this.commandResultExtra = extra;
            },
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

  public doCommand<R>(command: ICollaCommandOptions): Promise<ICommandExecutionResult<R>> {
    this.commandResultExtra = undefined;
    // NOTE execute is sync, so the modifcation of commandResultExtra is safe, no data race will happen.
    const result = this.commandManager.execute<R>(command);
    if (result.result === ExecuteResult.Success) {
      result['extra'] = this.commandResultExtra;
    }
    return Promise.resolve(result as ICommandExecutionResult<R>);
  }

  public get snapshot(): ISnapshot {
    return this.datasheetPack.snapshot;
  }

  public getView(options: Omit<IViewOptions, 'store'>): Promise<View> {
    return Promise.resolve(new View(this, { ...options, store: this.store }));
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
        await handler.handle(event as any);
      }
    }
  }
}

export interface IDatasheetOptions extends ILoadDatasheetPackOptions {
  createStore?: (dst: IBaseDatasheetPack) => Promise<Store<IReduxState>>;
}

export type ICommandExecutionResult<R> =
  | (ICollaCommandExecuteSuccessResult<R> & { extra: any })
  | ICollaCommandExecuteFailResult
  | ICollaCommandExecuteNoneResult;
