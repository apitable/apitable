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
import { InjectLogger } from 'common';
import { applyMiddleware, createStore, Store } from 'redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import { Logger } from 'winston';
import { ICommandInterface } from '../i.command.interface';

/**
 * <p>
 * 实现类
 * </p>
 * @author Zoe zheng
 * @date 2020/8/20 11:23 上午
 */
@Injectable()
export class CommandService implements ICommandInterface {
  constructor(
    @InjectLogger() private readonly logger: Logger
  ) { }

  fullFillStore(spaceId: string, datasheetPack: IServerDatasheetPack, userInfo?: IUserInfo): any {
    const store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));
    store.dispatch(StoreActions.setPageParams({ datasheetId: datasheetPack.datasheet.id, spaceId }));

    if (datasheetPack.foreignDatasheetMap) {
      Object.keys(datasheetPack.foreignDatasheetMap).forEach(dstId => {
        // 不校验关联表 关联表需要设置为以连接，不然无法写入关联数据
        store.dispatch(StoreActions.setDatasheetConnected(dstId));
        const dataPack = datasheetPack.foreignDatasheetMap![dstId];
        store.dispatch(StoreActions.receiveDataPack(dataPack, true));
        dataPack.fieldPermissionMap && store.dispatch(StoreActions.loadFieldPermissionMap(dataPack.fieldPermissionMap, dstId));
      });
    }
    if (datasheetPack.units) {
      // 初始化 UnitMap，供 Member 字段使用
      const unitMap = {};
      (datasheetPack.units as IUnitValue[]).filter(unit => unit.unitId).forEach(unit => (unitMap[unit.unitId] = unit));
      store.dispatch(StoreActions.updateUnitMap(unitMap));
      // 初始化 UserMap，供 CreatedBy/LastModifiedBy 字段使用
      const userMap = {};
      (datasheetPack.units as IUserValue[]).filter(unit => unit.uuid).forEach(user => (userMap[user.uuid] = user));
      store.dispatch(StoreActions.updateUserMap(userMap));
    }
    if (datasheetPack.fieldPermissionMap) {
      store.dispatch(StoreActions.loadFieldPermissionMap(datasheetPack.fieldPermissionMap, datasheetPack.datasheet.id));
    }
    store.dispatch(StoreActions.setDatasheetConnected(datasheetPack.datasheet.id));
    store.dispatch(StoreActions.receiveDataPack(datasheetPack));

    // 填充当前用户信息，和个人筛选逻辑相关
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
          // 不校验关联表 关联表需要设置为以连接，不然无法写入关联数据
          store.dispatch(StoreActions.setDatasheetConnected(dstId));
          const dataPack = datasheetPack.foreignDatasheetMap![dstId];
          store.dispatch(StoreActions.receiveDataPack(dataPack, true));
        });
      }
      if (datasheetPack.units) {
        // 初始化 UnitMap，供 Member 字段使用
        const unitMap = {};
        (datasheetPack.units as IUnitValue[]).filter(unit => unit.unitId).forEach(unit => (unitMap[unit.unitId] = unit));
        store.dispatch(StoreActions.updateUnitMap(unitMap));
        // 初始化 UserMap，供 CreatedBy/LastModifiedBy 字段使用
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

  applyJOTOperations(
    resourceId: string,
    operates: IOperation[],
    store: Store<IReduxState>,
    datasheets?: { [dstId: string]: { resourceType: ResourceType; revision: number } },
  ) {
    store.dispatch(StoreActions.applyJOTOperations(operates, datasheets ? datasheets[resourceId].resourceType : ResourceType.Datasheet, resourceId));
    if (datasheets) {
      Object.keys(datasheets).forEach(dstId => {
        store.dispatch(StoreActions.updateRevision(datasheets[dstId].revision, dstId, datasheets[dstId].resourceType));
      });
    }
  }

  setPageParam(payload: { datasheetId: string; spaceId?: string }, store: Store<IReduxState>) {
    store.dispatch(StoreActions.setPageParams(payload));
    return store;
  }

  execute<R>(options: ICollaCommandOptions, store: any): { result: ICollaCommandExecuteResult<R>; changeSets: ILocalChangeset[] } {
    const changeSets: ILocalChangeset[] = [];
    const manager = this.getCommandManager(store, changeSets);
    const result = manager.execute<R>(options);
    // 执行成功后将变更 apply 到内存 store 中
    if (result && result.result == ExecuteResult.Success)
      changeSets.forEach(cs => {
        store.dispatch(StoreActions.applyJOTOperations(cs.operations, cs.resourceType, cs.resourceId));
      });
    return { changeSets, result };
  }

  getCommandManager(store: any, changeSets: ILocalChangeset[]) {
    return new CollaCommandManager(
      {
        // command 所有的 op 都已经应用到 state 之后，会调用这里。
        handleCommandExecuted: (resourceOpsCollects: IResourceOpsCollect[]) => {
          resourceOpsCollects.forEach(collect => {
            const { resourceId, resourceType, operations } = collect;
            // 一个表一个changeSet
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
