import { IStoreProvider } from '../store.provider.interface';
import { Store, AnyAction } from 'redux';
import { IBaseDatasheetPack, IReduxState } from '@apitable/core';
import { CommandService } from 'database/services/command/command.service';
import { MockDataLoader } from './mock.data.loader';

export class MockStoreProvider implements IStoreProvider {
  createStore(datasheetPack: IBaseDatasheetPack): Promise<Store<IReduxState, AnyAction>> {
    const commandService = new CommandService({} as any);
    const store = commandService.fullFillStore(datasheetPack);
    return Promise.resolve(store);
  }
}
