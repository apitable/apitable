import { IReduxState } from "@apitable/core";
import { Store } from "redux";
import { IDataLoader } from "./data.loader.interface";
import { Datasheet, IDatasheetOptions } from "./datasheet";
import { IStoreProvider } from "./store.provider.interface";

export class Database {

  private loader!: IDataLoader;
  private stores: WeakMap<Datasheet, Store<IReduxState>> = new WeakMap();
  private storeProvider!: IStoreProvider;

  setDataLoader(loader: IDataLoader): void {
    this.loader = loader;
  }

  setStoreProvider(provider: IStoreProvider) {
    this.storeProvider = provider;
  }

  async getDatasheet(dstId: string, options: IDatasheetOptions): Promise<Datasheet> {
    const datasheetPack = await this.loader.loadDatasheetPack(dstId, options);
    const store = await this.storeProvider.createStore(datasheetPack);
    const datasheet = new Datasheet(datasheetPack, store);
    this.stores.set(datasheet, store);
    return datasheet;
  }
}
