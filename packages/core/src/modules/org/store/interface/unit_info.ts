/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
  avatarColor?: number;
  nickName?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  isSelf?: boolean;

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
  // real unitId
  originalUnitId?: string;
}

export interface IUserValue extends IUnitBase {
  userId: string;
  // whether user has modified nickname
  isNickNameModified?: boolean;
  // whether member has modified member name
  isMemberNameModified?: boolean;
}

