/**
 * user base information
 * @author Zoe zheng
 * @date 2020/8/13 5:09 PM
 */
export interface INamedUser {
  id: number;
  uuid: string;
  avatar: string;
  nikeName: string;
  isSocialNameModified: number;
}

/**
 * user base information
 * @author Zoe zheng
 * @date 2020/8/13 5:09 PM
 */
export interface IUserBaseInfoMap {
  [userId: number]: INamedUser;
}
