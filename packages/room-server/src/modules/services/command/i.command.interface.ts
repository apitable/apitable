import {
  CollaCommandManager,
  IBaseDatasheetPack,
  ICollaCommandExecuteResult,
  ICollaCommandOptions,
  IForeignDatasheetMap,
  ILocalChangeset,
  IUserInfo,
} from '@vikadata/core';

export interface ICommandInterface {
  /**
   * 用 datasheetPack 数据初始化redux store
   * @param spaceId 空间ID
   * @param datasheetPack
   * @return any
   * @author Zoe Zheng
   * @date 2020/8/20 12:19 下午
   */
  fullFillStore(spaceId: string, datasheetPack: IBaseDatasheetPack & IForeignDatasheetMap, userInfo?: IUserInfo): any;

  /**
   * 获取manager和changeSets
   * @param userUuid
   * @param store
   * @param changeSet
   * @return CollaCommandManager
   * @author Zoe Zheng
   * @date 2020/8/20 2:39 下午
   */
  getCommandManager(store: any, changeSet: ILocalChangeset[]): CollaCommandManager;

  /**
   *
   * @param userUuid
   * @param options
   * @param store
   * @return
   * @author Zoe Zheng
   * @date 2020/8/29 12:00 下午
   */
  execute<R>(options: ICollaCommandOptions, store: any): { result: ICollaCommandExecuteResult<R>; changeSets: ILocalChangeset[] };
}
