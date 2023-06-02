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

import { IUserValue, MemberType } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { PermissionException, ServerException } from 'shared/exception';
import { UnitMemberRepository } from '../repositories/unit.member.repository';
import { UserService } from '../../user/services/user.service';
import { UnitMemberBaseInfoVo } from '../vos/unit.member.vo';

@Injectable()
export class UnitMemberService {
  constructor(
    private readonly memberRepo: UnitMemberRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Get member base infos by member ids
   *
   * @param memberIds
   * @return
   * @author Zoe Zheng
   * @date 2020/7/30 5:39 PM
   */
  public async getMembersBaseInfo(memberIds: number[]): Promise<{ [memberId: number]: IUserValue }> {
    if (memberIds.length > 0) {
      const members = await this.memberRepo.selectMembersByIdsIncludeDeleted(memberIds);
      const userIds = members.reduce<number[]>((pre, cur) => {
        if (cur.userId != null) pre.push(cur.userId);
        return pre;
      }, []);
      const users = userIds.length ? await this.userService.getUserBaseInfoMapByUserIds(userIds) : new Map();
      return members.reduce<{ [memberId: number]: IUserValue }>((pre, cur) => {
        const user = users.get(cur.userId);
        pre[cur.id] = {
          uuid: user?.uuid,
          userId: user?.uuid,
          name: cur.memberName,
          type: MemberType.Member,
          avatar: user?.avatar,
          nickName: user?.nikeName,
          avatarColor: user?.color,
          isActive: cur.isActive,
          isDeleted: cur.isDeleted,
          isNickNameModified: user?.isSocialNameModified !== 0,
          isMemberNameModified: cur.isSocialNameModified !== 0,
        };
        return pre;
      }, {});
    }
    return {};
  }

  /**
   * 
   * @param memberIds 
   * @returns 
   */
  public async getMemberBasicInfo(memberIds: number[]): Promise<{ [memberId: number]: IUserValue }> {
    if (memberIds.length > 0) {
      const members = await this.memberRepo.selectMembersByIdsIncludeDeleted(memberIds);
      return members.reduce<{ [memberId: number]: IUserValue }>((pre, cur) => {
        // const unit = units.filter((unit) => String(unit.unitRefId) === cur.id)[0];
        pre[cur.id] = {
          userId: cur.userId,
          // unitId: unit?.id,
          name: cur.memberName,
          isActive: cur.isActive,
          isDeleted: cur.isDeleted,
          isMemberNameModified: cur.isSocialNameModified !== 0,
        };
        return pre;
      }, {});
    }
    return {};
  }

  public async getIdBySpaceIdAndName(spaceId: string, memberName: string): Promise<string | null> {
    const rawData = await this.memberRepo.selectIdBySpaceIdAndName(spaceId, memberName);
    if (rawData) return rawData.id;
    return null;
  }

  public async getIdBySpaceIdAndUserId(spaceId: string, userId: string): Promise<string | null> {
    const entity = await this.memberRepo.selectIdBySpaceIdAndUserId(spaceId, userId);
    return entity ? entity.id : null;
  }

  /**
   * Check if the user is in the space
   */
  public async checkUserIfInSpace(userId: string, spaceId: string) {
    const memberId = await this.getIdBySpaceIdAndUserId(spaceId, userId);
    if (isEmpty(memberId)) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
    return;
  }

  public async getMembersBaseInfoBySpaceIdAndUserIds(
    spaceId: string,
    userIds: string[],
    excludeDeleted = true,
  ): Promise<{ [userId: string]: UnitMemberBaseInfoVo }> {
    const members = await this.memberRepo.selectMembersBySpaceIdAndUserIds(spaceId, userIds, excludeDeleted);
    if (!members || !members.length) return {};
    return members.reduce<{
      [userId: string]: {
        memberId: string, memberName: string; isActive: boolean; isDeleted: boolean; isMemberNameModified: boolean; unitId: string
      }
    }>((pre, cur) => {
      pre[cur.userId] = {
        memberId: cur.id,
        memberName: cur.memberName,
        isDeleted: cur.isDeleted,
        isActive: !!cur.isActive,
        isMemberNameModified: cur.isMemberNameModified!,
        unitId: cur.unitId,
      };
      return pre;
    }, {});
  }

  async selectSpaceIdsByUserId(userId: string): Promise<string[]> {
    return await this.memberRepo.selectSpaceIdsByUserId(userId);
  }
}
