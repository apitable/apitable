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
  DEFAULT_EDITOR_PERMISSION,
  ExecuteResult,
  ICollaCommandExecuteResult,
  ICollaCommandOptions,
  IError,
  ILocalChangeset,
  INodeMeta,
  IReduxState,
  IResourceOpsCollect,
  IServerDashboardPack,
  IServerDatasheetPack,
  ISnapshot,
  IUnitValue,
  IUserInfo,
  IUserValue,
  IWidget,
  Reducers,
  resourceOpsToChangesets,
  StoreActions,
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { applyMiddleware, createStore, Store } from 'redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';

/**
 * @author Zoe zheng
 * @date 2020/8/20 11:23 AM
 */
@Injectable()
export class CommandService {
  constructor(@InjectLogger() private readonly logger: Logger) {
  }

  fullFillStore(datasheetPack: IServerDatasheetPack, userInfo?: IUserInfo): Store<IReduxState> {
    const store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));
    store.dispatch(
      StoreActions.setPageParams({
        datasheetId: datasheetPack.datasheet.id,
        spaceId: datasheetPack.datasheet.spaceId,
      }),
    );

    if (datasheetPack.foreignDatasheetMap) {
      Object.keys(datasheetPack.foreignDatasheetMap).forEach(dstId => {
        // Don't check linked datasheet, linked datasheet should be set to connected, or linked data can not be written
        store.dispatch(StoreActions.setDatasheetConnected(dstId));
        const dataPack = datasheetPack.foreignDatasheetMap![dstId]!;
        store.dispatch(StoreActions.receiveDataPack(dataPack, { isPartOfData: true, fixConsistency: false }));
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
      (datasheetPack.units as IUserValue[]).filter(unit => unit.uuid).forEach(user => (userMap[user.uuid!] = user));
      store.dispatch(StoreActions.updateUserMap(userMap));
    }
    if (datasheetPack.fieldPermissionMap) {
      store.dispatch(StoreActions.loadFieldPermissionMap(datasheetPack.fieldPermissionMap, datasheetPack.datasheet.id));
    }
    store.dispatch(StoreActions.setDatasheetConnected(datasheetPack.datasheet.id));
    store.dispatch(StoreActions.receiveDataPack(datasheetPack, { fixConsistency: false }));

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
          const dataPack = datasheetPack.foreignDatasheetMap![dstId]!;
          store.dispatch(StoreActions.receiveDataPack(dataPack, { isPartOfData: true, fixConsistency: false }));
        });
      }
      if (datasheetPack.units) {
        // Initialize UnitMap for member fields
        const unitMap = {};
        (datasheetPack.units as IUnitValue[]).filter(unit => unit.unitId).forEach(unit => (unitMap[unit.unitId] = unit));
        store.dispatch(StoreActions.updateUnitMap(unitMap));
        // Initialize UserMap for CreatedBy/LastModifiedBy fields
        const userMap = {};
        (datasheetPack.units as IUserValue[]).filter(unit => unit.uuid).forEach(user => (userMap[user.uuid!] = user));
        store.dispatch(StoreActions.updateUserMap(userMap));
      }
      store.dispatch(StoreActions.setDatasheetConnected(datasheetPack.datasheet.id));
      store.dispatch(StoreActions.receiveDataPack(datasheetPack, { isPartOfData: true, fixConsistency: false }));
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
      store.dispatch(
        store.dispatch(
          StoreActions.receiveDataPack({ datasheet: pack.datasheet, snapshot: pack.snapshot }, { isPartOfData: true, fixConsistency: false }),
        ),
      );
    });
    return store;
  }

  fillDashboardStore(payload: IServerDashboardPack): Store<IReduxState> {
    const store = createStore<IReduxState, any, unknown, unknown>(Reducers.rootReducers, applyMiddleware(thunkMiddleware, batchDispatchMiddleware));
    store.dispatch(StoreActions.setDashboard(payload.dashboard, payload.dashboard.id));
    store.dispatch(StoreActions.setPageParams({ dashboardId: payload.dashboard.id }));
    if (payload.widgetMap) {
      Object.keys(payload.widgetMap).forEach(widgetId => {
        store.dispatch(StoreActions.receiveInstallationWidget(widgetId, payload.widgetMap[widgetId] as any as IWidget));
      });
    }
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
    if (result && result.result == ExecuteResult.Success) {
      changeSets.forEach(cs => {
        store.dispatch(StoreActions.applyJOTOperations(cs.operations, cs.resourceType, cs.resourceId));
      });
    }
    return { changeSets, result };
  }

  getCommandManager(store: Store<IReduxState>, changeSets: ILocalChangeset[]) {
    return new CollaCommandManager(
      {
        // After all ops in command have been applied to state, here is reached.
        handleCommandExecuted: (resourceOpsCollects: IResourceOpsCollect[]) => {
          changeSets.push(...resourceOpsToChangesets(resourceOpsCollects, store.getState()));
        },
        handleCommandExecuteError: (error: IError) => {
          this.logger.error('CommandExecuteError', { error });
        },
      },
      store,
    );
  }
}
