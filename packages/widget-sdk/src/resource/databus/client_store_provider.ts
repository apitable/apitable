import { databus, IReduxState, IServerDashboardPack, IServerDatasheetPack, StoreActions } from '@apitable/core';
import { AnyAction, Store } from 'redux';
import { batchActions } from 'redux-batched-actions';

export class ClientStoreProvider implements databus.IStoreProvider {
  constructor(private readonly store: Store<IReduxState>) {}

  createDatasheetStore(dataPack: IServerDatasheetPack, options: IClientStoreOptions): Store<IReduxState> {
    // TODO outdated. Refer to fetchDatasheetPackSuccess for latest code.
    const { isPartOfData, needLoad } = options;
    if (!needLoad) {
      return this.store;
    }

    const dispatchActions: AnyAction[] = [];

    if (dataPack.foreignDatasheetMap) {
      Object.keys(dataPack.foreignDatasheetMap).forEach(foreignDstId => {
        const foreignDatasheetPack = dataPack.foreignDatasheetMap![foreignDstId]!;
        dispatchActions.push(StoreActions.receiveDataPack(foreignDatasheetPack, { isPartOfData: true }));
        if (foreignDatasheetPack.fieldPermissionMap) {
          dispatchActions.push(StoreActions.loadFieldPermissionMap(foreignDatasheetPack.fieldPermissionMap, foreignDatasheetPack.datasheet.id));
        }
      });
    }

    if (dataPack.datasheet) {
      dispatchActions.push(StoreActions.receiveDataPack(dataPack, { isPartOfData, getState: this.store.getState }));
      if (dataPack.units) {
        // init unityMap, for `member` field use
        const unitMap = {};
        dataPack.units.filter(unit => unit.unitId).forEach(unit => (unitMap[unit.unitId!] = unit));
        this.store.dispatch(StoreActions.updateUnitMap(unitMap));

        // init UserMap, for `CreatedBy`/`LastModifiedBy` field use
        const userMap = {};
        dataPack.units.filter(unit => unit.userId).forEach(user => (userMap[user.userId!] = user));
        this.store.dispatch(StoreActions.updateUserMap(userMap));
      }
    }

    if (dataPack.fieldPermissionMap) {
      this.store.dispatch(StoreActions.loadFieldPermissionMap(dataPack.fieldPermissionMap, dataPack.datasheet.id));
    }

    this.store.dispatch(batchActions(dispatchActions));
    return this.store;
  }

  createDashboardStore(_dataPack: IServerDashboardPack): Store<IReduxState> {
    return this.store;
  }
}

export interface IClientStoreOptions extends databus.IStoreOptions {
  isPartOfData: boolean;
  needLoad: boolean;
}
