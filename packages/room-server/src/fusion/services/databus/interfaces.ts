import type { IDatasheetOptions } from "fusion/databus";
import { IAuthHeader, IFetchDataOptions } from "shared/interfaces";

export interface IServerDatasheetOptions extends IDatasheetOptions, IFetchDataOptions {
  auth: IAuthHeader
}