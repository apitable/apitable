import { IServerDatasheetPack } from 'exports/store';

export interface IDataLoader {
  /**
   * Loads a datasheet pack for a datasheet from the data source. Returns null if the datasheet is not found.
   *
   * The implemention may customize fields in `options`.
   */
  loadDatasheetPack(dstId: string, options: ILoadDatasheetPackOptions): Promise<IServerDatasheetPack | null> | IServerDatasheetPack | null;
}

/**
 * The options of loading datasheet packs. Implementors of `IDataLoader` can derive this interface, adding necessary fields.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILoadDatasheetPackOptions {}