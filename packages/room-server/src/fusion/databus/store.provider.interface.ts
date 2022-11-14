import { Store } from 'redux';
import { IBaseDatasheetPack, IReduxState } from '@apitable/core';

export interface IStoreProvider {
  createStore(datasheetPack: IBaseDatasheetPack): Promise<Store<IReduxState>>;
}
