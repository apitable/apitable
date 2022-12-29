import { IServerDatasheetPack } from "@apitable/core";
import { IDataLoader, IDataSelector, ILoadDataOptions, ILoadDatasheetPackOptions } from "fusion/databus";
import { DatasheetService } from "database/services/datasheet/datasheet.service";
import { IAuthHeader, IFetchDataOptions } from "shared/interfaces";

export class ServerDataLoader implements IDataLoader {
  constructor(private readonly datasheetService: DatasheetService) {
  }

  loadDatasheetPack(dstId: string, options: IServerLoadDatasheetPackOptions): Promise<IServerDatasheetPack> {
    const { auth } = options;
    return this.datasheetService.fetchDataPack(dstId, auth, options);
  }

  load<T>(_selector: IDataSelector<T>, _options: ILoadDataOptions): Promise<T> {
    throw new Error('TODO')
  }
}

export interface IServerLoadDatasheetPackOptions extends ILoadDatasheetPackOptions, IFetchDataOptions {
  auth: IAuthHeader
}