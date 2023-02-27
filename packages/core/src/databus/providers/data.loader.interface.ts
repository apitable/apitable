import { IServerDatasheetPack } from 'exports/store';

/**
 * A data loader is responsible for loading internal datasheet packs for `Datasheet`s from different data sources.
 * 
 * For example, in the front end, a data loader implementation fetches datasheet packs from the server;
 * while in the back end, another data loader implementation loads datasheet packs from the database.
 */
export interface IDataLoader {
  /**
   * Loads a datasheet pack for a datasheet from the data source.
   *
   * The implementor can derive `ILoadDatasheetPackOptions` and add custom fields.
   */
  loadDatasheetPack(dstId: string, options: ILoadDatasheetPackOptions): Promise<ILoadDatasheetPackResult> | ILoadDatasheetPackResult;
}

/**
 * The options of loading datasheet packs. Implementors of `IDataLoader` can derive this interface, adding necessary fields.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILoadDatasheetPackOptions {}

/**
 * The result of loading a datasheet pack.
 */
export interface ILoadDatasheetPackResult {
  /**
   * If the datasheet is not found, this field is null.
   */
  datasheetPack: IServerDatasheetPack | null;
}
