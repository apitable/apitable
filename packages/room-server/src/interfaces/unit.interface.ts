import { MemberType } from '@vikadata/core';

/**
 * <p>
 *  组织type对应的refId的数组类型
 *  枚举这里只能用type定义类型
 * </p>
 * @author Zoe zheng
 * @date 2020/7/30 5:16 下午
 */
export type IUnitMemberRefIdMap = {
  [unitType in MemberType]: number[];
};

/**
 * <p>
 * 成员基本信息
 * </p>
 * @author Zoe zheng
 * @date 2020/7/30 5:27 下午
 */
export interface IMemberBaseInfo {
  /**
   * 成员ID
   */
  memberId: string;
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 空间ID
   */
  spaceId: string;
  /**
   * 成员名称
   */
  memberName: string;
  /**
   * 成员mobile
   */
  mobile: string;
  /**
   * 用户头像
   */
  avatar?: string;
  /**
   * 用户的uuID
   */
  uuid?: string;

  isMemberNameModified?: boolean; 

  isActive: number;
}

/**
 * <p>
 * 小组基本信息
 * </p>
 * @author Zoe zheng
 * @date 2020/8/13 5:23 下午
 */
export interface IUnitTeamBaseInfo {
  id: number;
  teamName: string;
  groupId: number;
}

/**
 * <p>
 * 小组基本信息
 * </p>
 * @author Zoe zheng
 * @date 2020/7/30 6:07 下午
 */
export interface IUnitTeamBaseInfoMap {
  [teamId: number]: IUnitTeamBaseInfo;
}
