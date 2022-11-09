import { Store } from 'redux';
import { IReduxState } from '../exports/store';
import { Datasheet, IDataLoader, IDatasheetOptions } from '.';

export class Database {
  constructor(private readonly options: IDatabaseOptions, private readonly loader: IDataLoader) {}

  async getDatasheet<O extends IDatasheetOptions>(dstId: string, options: O): Promise<Datasheet> {
    const datasheetPack = await this.loader.loadDatasheetPack(dstId, { ...options, databaseOptions: this.options });
    let store: Store<IReduxState>;
    if (typeof options.store === 'function') {
      const getStore = options.store;
      store = await getStore(datasheetPack);
    } else {
      store = options.store;
    }
    return new Datasheet(datasheetPack, store);
  }
}

export interface IDatabaseOptions {}
