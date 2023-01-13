import { IDataLoader, ILoadDatasheetPackOptions } from 'databus/providers';
import { IServerDatasheetPack } from 'exports/store';

export class DataLoader implements IDataLoader {
  loadDatasheetPack(dstId: string, options: IClientLoadDatasheetPackOptions): Promise<IServerDatasheetPack | null> | IServerDatasheetPack | null {}
}

export interface IClientLoadDatasheetPackOptions extends ILoadDatasheetPackOptions {
  shareId?: string;
  templateId?: string;
  embedId?: string;
  recordIds?: string | string[];
}
