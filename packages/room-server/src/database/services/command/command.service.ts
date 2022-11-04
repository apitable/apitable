import { Injectable } from '@nestjs/common';
import {
  CollaCommandManager,
  DEFAULT_EDITOR_PERMISSION,
  ExecuteResult,
  generateRandomString,
  ICollaCommandExecuteResult,
  ICollaCommandOptions,
  IError,
  ILocalChangeset,
  INodeMeta,
  IOperation,
  IReduxState,
  IResourceOpsCollect,
  IServerDatasheetPack,
  ISnapshot,
  IUnitValue,
  IUserInfo,
  IUserValue,
  Reducers,
  ResourceType,
  Selectors,
  StoreActions
} from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import { applyMiddleware, createStore, Store } from 'redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import { Logger } from 'winston';

/**
 * @author Zoe zheng
 * @date 2020/8/20 11:23 AM
 */
@Injectable()
export class CommandService {
  constructor(
    @InjectLogger() private readonly logger: Logger
  ) { }

  fullFillStore(datasheetPack: IServerDatasheetPack, userInfo?: IUserInfo): any {
    const store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));
    store.dispatch(StoreActions.setPageParams({
      datasheetId: datasheetPack.datasheet.id,
      spaceId: datasheetPack.datasheet.spaceId
    }));

    if (datasheetPack.foreignDatasheetMap) {
      Object.keys(datasheetPack.foreignDatasheetMap).forEach(dstId => {
        // Don't check linked datasheet, linked datasheet should be set to connected, or linked data can not be written
        store.dispatch(StoreActions.setDatasheetConnected(dstId));
        const dataPack = datasheetPack.foreignDatasheetMap![dstId];
        store.dispatch(StoreActions.receiveDataPack(dataPack, true));
        dataPack.fieldPermissionMap && store.dispatch(StoreActions.loadFieldPermissionMap(dataPack.fieldPermissionMap, dstId));
      });
    }
    if (datasheetPack.units) {
      // Initialize UnitMap for member fields
      const unitMap = {};
      (datasheetPack.units as IUnitValue[]).filter(unit => unit.unitId).forEach(unit => (unitMap[unit.unitId] = unit));
      store.dispatch(StoreActions.updateUnitMap(unitMap));
      // Initialize UserMap for CreatedBy/LastModifiedBy fields
      const userMap = {};
      (datasheetPack.units as IUserValue[]).filter(unit => unit.uuid).forEach(user => (userMap[user.uuid] = user));
      store.dispatch(StoreActions.updateUserMap(userMap));
    }
    if (datasheetPack.fieldPermissionMap) {
      store.dispatch(StoreActions.loadFieldPermissionMap(datasheetPack.fieldPermissionMap, datasheetPack.datasheet.id));
    }
    store.dispatch(StoreActions.setDatasheetConnected(datasheetPack.datasheet.id));
    store.dispatch(StoreActions.receiveDataPack(datasheetPack));

    // Fill current user info, relates to personal filtering
    if (userInfo) {
      store.dispatch(StoreActions.setUserMe(userInfo));
    }
    return store;
  }

  fillTinyStore(dstPacks: IServerDatasheetPack[]): Store<IReduxState> {
    const store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));
    // this.logger.debug('fillTinyStore.datasheetPacks', dstPacks);
    dstPacks.forEach(datasheetPack => {
      if (datasheetPack.foreignDatasheetMap) {
        Object.keys(datasheetPack.foreignDatasheetMap).forEach(dstId => {
          // Don't check linked datasheet, linked datasheet should be set to connected, or linked data can not be written
          store.dispatch(StoreActions.setDatasheetConnected(dstId));
          const dataPack = datasheetPack.foreignDatasheetMap![dstId];
          store.dispatch(StoreActions.receiveDataPack(dataPack, true));
        });
      }
      if (datasheetPack.units) {
        // Initialize UnitMap for member fields
        const unitMap = {};
        (datasheetPack.units as IUnitValue[]).filter(unit => unit.unitId).forEach(unit => (unitMap[unit.unitId] = unit));
        store.dispatch(StoreActions.updateUnitMap(unitMap));
        // Initialize UserMap for CreatedBy/LastModifiedBy fields
        const userMap = {};
        (datasheetPack.units as IUserValue[]).filter(unit => unit.uuid).forEach(user => (userMap[user.uuid] = user));
        store.dispatch(StoreActions.updateUserMap(userMap));
      }
      store.dispatch(StoreActions.setDatasheetConnected(datasheetPack.datasheet.id));
      store.dispatch(StoreActions.receiveDataPack(datasheetPack, true));
    });
    // const state = store.getState();
    // this.logger.debug('fillTinyStore.state', state);
    return store;
  }

  fillStore(payload: { datasheet: INodeMeta; snapshot: ISnapshot }[]): Store<IReduxState> {
    const store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));
    payload.forEach(pack => {
      const datasheet = pack.datasheet;
      if (!datasheet.permissions) {
        datasheet.permissions = DEFAULT_EDITOR_PERMISSION;
      }
      store.dispatch(store.dispatch(StoreActions.receiveDataPack({ datasheet: pack.datasheet, snapshot: pack.snapshot }, true)));
    });
    return store;
  }

  setPageParam(payload: { datasheetId: string; spaceId?: string }, store: Store<IReduxState>) {
    store.dispatch(StoreActions.setPageParams(payload));
    return store;
  }

  execute<R>(options: ICollaCommandOptions, store: any): { result: ICollaCommandExecuteResult<R>; changeSets: ILocalChangeset[] } {
    const changeSets: ILocalChangeset[] = [];
    const manager = this.getCommandManager(store, changeSets);
    const result = manager.execute<R>(options);
    // Apply changes into store after execution succeeds
    if (result && result.result == ExecuteResult.Success)
      changeSets.forEach(cs => {
        store.dispatch(StoreActions.applyJOTOperations(cs.operations, cs.resourceType, cs.resourceId));
      });
    return { changeSets, result };
  }

  getCommandManager(store: any, changeSets: ILocalChangeset[]) {
    return new CollaCommandManager(
      {
        // After all ops in command have been applied to state, here is reached.
        handleCommandExecuted: (resourceOpsCollects: IResourceOpsCollect[]) => {
          resourceOpsCollects.forEach(collect => {
            const { resourceId, resourceType, operations } = collect;
            // One datasheet, one changeset
            const existChangeSet = changeSets.find(cs => cs.resourceId === resourceId);
            const datasheet = Selectors.getDatasheet(store.getState(), resourceId);
            if (existChangeSet) {
              existChangeSet.operations.push(...operations);
            } else {
              changeSets.push({
                baseRevision: datasheet.revision,
                messageId: generateRandomString(),
                resourceId,
                resourceType,
                operations,
              });
            }
          });
        },
        handleCommandExecuteError: (error: IError) => {
          this.logger.error('CommandExecuteError', { error });
        },
      },
      store,
    );
  }
}
