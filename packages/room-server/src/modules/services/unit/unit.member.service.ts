import { Injectable } from '@nestjs/common';
import { IUserValue, MemberType } from '@apitable/core';
import { PermissionException } from 'exception/permission.exception';
import { ServerException } from 'exception/server.exception';
import { isEmpty } from 'lodash';
import { UnitMemberRepository } from 'modules/repository/unit.member.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class UnitMemberService {
  constructor(private readonly memberRepo: UnitMemberRepository, private readonly userService: UserService) {}

  /**
   * 根据memberIds获取对应的名称
   * @param memberIds
   * @return
   * @author Zoe Zheng
   * @date 2020/7/30 5:39 下午
   */
  async getMembersBaseInfo(memberIds: number[]): Promise<{ [memberId: number]: IUserValue }> {
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

  async getIdBySpaceIdAndName(spaceId: string, memberName: string): Promise<string | null> {
    const rawData = await this.memberRepo.selectIdBySpaceIdAndName(spaceId, memberName);
    if (rawData) return rawData.id;
    return null;
  }

  async getIdBySpaceIdAndUserId(spaceId: string, userId: string): Promise<string | null> {
    const entity = await this.memberRepo.selectIdBySpaceIdAndUserId(spaceId, userId);
    return entity ? entity.id : null;
  }

  getCountBySpaceIdAndId(id: string, spaceId: string): Promise<number> {
    return this.memberRepo.selectCountByIdAndSpaceId(id, spaceId);
  }

  /**
   * 检查用户是否存在此空间
   */
  async checkUserIfInSpace(userId: string, spaceId: string) {
    const memberId = await this.getIdBySpaceIdAndUserId(spaceId, userId);
    if (isEmpty(memberId)) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
    return;
  }

  async getMembersBaseInfoBySpaceIdAndUserIds(
    spaceId: string,
    userIds: string[],
    excludeDeleted = true,
  ): Promise<{ [userId: string]: {
    memberId: string, memberName: string; isActive: boolean; isDeleted: boolean; isMemberNameModified: boolean; unitId: string } }> {
    const members = await this.memberRepo.selectMembersBySpaceIdAndUserIds(spaceId, userIds, excludeDeleted);
    if (!members || !members.length) return {};
    return members.reduce<{[userId: string]: { 
      memberId: string, memberName: string; isActive: boolean; isDeleted: boolean; isMemberNameModified: boolean; unitId: string
    }}>((pre, cur) => {
      pre[cur.userId] = {
        memberId: cur.id,
        memberName: cur.memberName,
        isDeleted: cur.isDeleted,
        isActive: !!cur.isActive,
        isMemberNameModified: cur.isMemberNameModified,
        unitId: cur.unitId,
      };
      return pre;
    }, {});
  }
}
