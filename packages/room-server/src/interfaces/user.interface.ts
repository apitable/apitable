/**
 * <p>
 * 用户基本信息
 * </p>
 * @author Zoe zheng
 * @date 2020/8/13 5:09 下午
 */
export interface INamedUser {
  id: number;
  uuid: string;
  avatar: string;
  nikeName: string;
  isSocialNameModified: number;
}

/**
 * <p>
 * 用户基本信息map
 * </p>
 * @author Zoe zheng
 * @date 2020/8/13 5:09 下午
 */
export interface IUserBaseInfoMap {
  [userId: number]: INamedUser;
}
