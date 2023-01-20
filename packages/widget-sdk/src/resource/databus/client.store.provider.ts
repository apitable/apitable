import { databus, IReduxState, IServerDatasheetPack, StoreActions } from '@apitable/core';
import { AnyAction, Store } from 'redux';
import { batchActions } from 'redux-batched-actions';

export class ClientStoreProvider implements databus.IStoreProvider {
  constructor(private readonly store: Store<IReduxState>) {}

  createStore(dataPack: IServerDatasheetPack, options: IClientStoreOptions): Store<IReduxState> {
    const { isPartOfData, fakePack } = options;
    if (fakePack) {
      return this.store;
    }

    const dispatchActions: AnyAction[] = [];

    if (dataPack.foreignDatasheetMap) {
      Object.keys(dataPack.foreignDatasheetMap).forEach(foreignDstId => {
        const foreignDatasheetPack = dataPack.foreignDatasheetMap![foreignDstId]!;
        dispatchActions.push(StoreActions.receiveDataPack(foreignDatasheetPack, true));
        if (foreignDatasheetPack.fieldPermissionMap) {
          dispatchActions.push(StoreActions.loadFieldPermissionMap(foreignDatasheetPack.fieldPermissionMap, foreignDatasheetPack.datasheet.id));
        }
      });
    }

    if (dataPack.datasheet) {
      dispatchActions.push(StoreActions.receiveDataPack(dataPack, isPartOfData, this.store.getState));
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
}

export interface IClientStoreOptions extends databus.IStoreOptions {
  isPartOfData: boolean;
  fakePack: boolean;
}
