import { IBaseDatasheetPack } from "@apitable/core";

export interface IDataLoader {
  loadDatasheetPack(dstId: string, options: ILoadDatasheetPackOptions): Promise<IBaseDatasheetPack>;

  load<T>(selector: IDataSelector<T>, options: ILoadDataOptions): Promise<T>;
}

export interface ILoadDatasheetPackOptions {
}

export interface IDataSelector<T> {
  apply(dataLoader: IDataLoader, options: ILoadDataOptions): Promise<T>
}

export interface ILoadDataOptions {
  dstId: string
}