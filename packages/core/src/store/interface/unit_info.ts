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
  // 考虑到数据兼容性，这里依然保留 uuid 字段
  uuid?: string;
  type?: MemberType;
  avatar?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  // 企微
  isMemberNameModified?: boolean;
  teamData?: ITeamData[];
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
  // 用户（user）是否修改过昵称
  isNickNameModified?: boolean;
  // 成员（member）是否修改过昵称
  isMemberNameModified?: boolean;
}

