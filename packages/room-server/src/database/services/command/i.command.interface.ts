import {
  CollaCommandManager,
  IBaseDatasheetPack,
  ICollaCommandExecuteResult,
  ICollaCommandOptions,
  IForeignDatasheetMap,
  ILocalChangeset,
  IUserInfo,
} from '@apitable/core';

export interface ICommandInterface {
  /**
   * Initialize redux store with datasheetPack data
   * 
   * @param spaceId space ID
   * @param datasheetPack
   * @return any
   * @author Zoe Zheng
   * @date 2020/8/20 12:19 PM
   */
  fullFillStore(spaceId: string, datasheetPack: IBaseDatasheetPack & IForeignDatasheetMap, userInfo?: IUserInfo): any;

  /**
   * Obtain command manager
   * @param userUuid
   * @param store
   * @param changeSet
   * @return CollaCommandManager
   * @author Zoe Zheng
   * @date 2020/8/20 2:39 PM
   */
  getCommandManager(store: any, changeSet: ILocalChangeset[]): CollaCommandManager;

  /**
   *
   * @param userUuid
   * @param options
   * @param store
   * @return
   * @author Zoe Zheng
   * @date 2020/8/29 12:00 PM
   */
  execute<R>(options: ICollaCommandOptions, store: any): { result: ICollaCommandExecuteResult<R>; changeSets: ILocalChangeset[] };
}
