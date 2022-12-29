import { MemberType } from '@apitable/core';

/**
 * unit member type reference ID 
 * @author Zoe zheng
 * @date 2020/7/30 5:16 PM
 */
export type IUnitMemberRefIdMap = {
  [unitType in MemberType]: number[];
};

/**
 * member base information
 * @author Zoe zheng
 * @date 2020/7/30 5:27 PM
 */
export interface IMemberBaseInfo {
  /**
   * member ID
   */
  memberId: string;
  /**
   * user ID
   */
  userId: string;
  /**
   * space ID
   */
  spaceId: string;
  /**
   * member name
   */
  memberName: string;
  /**
   * member mobile
   */
  mobile: string;
  /**
   * user avatar
   */
  avatar?: string;
  /**
   * user uuid
   */
  uuid?: string;

  isMemberNameModified?: boolean; 

  isActive: number;
}

/**
 * team base information
 * @author Zoe zheng
 * @date 2020/8/13 5:23 PM
 */
export interface IUnitTeamBaseInfo {
  id: number;
  teamName: string;
  groupId: number;
}

/**
 * team base information
 * @author Zoe zheng
 * @date 2020/7/30 6:07 PM
 */
export interface IUnitTeamBaseInfoMap {
  [teamId: number]: IUnitTeamBaseInfo;
}
