import { IServerDashboardPack, IServerDatasheetPack } from 'exports/store/interfaces';

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
   *
   * @returns If the datasheet is not found, null is returned.
   */
  loadDatasheetPack(datasheetId: string, options: ILoadDatasheetPackOptions): Promise<IServerDatasheetPack | null>;

  /**
   * Loads a dashboard pack for a dashboard from the data source.
   *
   * The implementor can derive `ILoadDataboardPackOptions` and add custom fields.
   *
   * @returns If the dashboard is not found, null is returned.
   */
  loadDashboardPack(dashboardId: string, options: ILoadDashboardPackOptions): Promise<IServerDashboardPack | null>
}

/**
 * The options of loading datasheet packs. Implementors of `IDataLoader` can derive this interface, adding necessary fields.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILoadDatasheetPackOptions {}

/**
 * The options of loading dashboard packs. Implementors of `IDataLoader` can derive this interface, adding necessary fields.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILoadDashboardPackOptions {}
