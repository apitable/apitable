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
