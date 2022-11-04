import { IBaseDatasheetPack } from "store";
import { IDatabaseOptions } from ".";

export interface IDataLoader {
  loadDatasheetPack(dstId: string, options: ILoadDatasheetPackOptions): Promise<IBaseDatasheetPack>;

  load<T>(selector: IDataSelector<T>, options: ILoadDataOptions): Promise<T>;
}

export interface ILoadDatasheetPackOptions {
  databaseOptions: IDatabaseOptions;
}

export interface IDataSelector<T> {
  apply(dataLoader: IDataLoader, options: ILoadDataOptions): Promise<T>
}

export interface ILoadDataOptions {
  dstId: string
}