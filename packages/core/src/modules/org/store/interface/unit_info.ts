import { MemberType } from 'types';
import { ITeamData } from './address_list';

export interface IUnitInfo {
  unitMap: IUnitMap | null,
  userMap: {
    [userId: string]: string | IUserValue
  } | null
}

interface IUnitBase {
  name: string;
  unitId?: string;
  userId?: string;

  /**
   * consider for compatibility
   * remain uuid field
   */
  uuid?: string;
  type?: MemberType;
  avatar?: string;
  isActive?: boolean;
  isDeleted?: boolean;

  /**
   * for wecom(wechat work)
   */
  isMemberNameModified?: boolean;
  teamData?: ITeamData[];
  desc?: string;
  unitRefId?: string;
}

export interface IUnitMap {
  [unitId: string]: IUnitValue
}

export interface IUserMap {
  [userId: string]: IUserValue
}

export interface IUnitValue extends IUnitBase {
  unitId: string;
  type: MemberType
}

export interface IUserValue extends IUnitBase {
  userId: string;
  // whether user has modified nickname
  isNickNameModified?: boolean;
  // whether member has modified member name
  isMemberNameModified?: boolean;
}

