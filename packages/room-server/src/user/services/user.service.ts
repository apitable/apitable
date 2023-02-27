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

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { EnvConfigKey } from 'shared/common';
import { IAuthHeader, INamedUser, IOssConfig, IUserBaseInfo } from 'shared/interfaces';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { RestService } from 'shared/services/rest/rest.service';
import { UnitMemberService } from 'unit/services/unit.member.service';
import { UnitInfo } from '../../database/interfaces';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { UserBaseInfoDto } from '../dtos/user.dto';
import { UnitInfoDto } from 'unit/dtos/unit.info.dto';
import { map } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly envConfigService: EnvConfigService,
    private readonly restService: RestService,
    @Inject(forwardRef(() => UnitMemberService))
    private readonly unitMemberService: UnitMemberService,
  ) {}

  /**
   * Get user info by UUIDs
   */
  async getUserInfo(spaceId: string, uuids: string[]): Promise<UnitInfo[]> {
    if (uuids.length === 0) {
      return await Promise.resolve([]);
    }
    const users: any[] = await this.userRepo.selectUserBaseInfoByUuids(uuids);
    const userIds: string[] = map(users, String('id'));
    const memberMap = await this.unitMemberService.getMembersBaseInfoBySpaceIdAndUserIds(spaceId, userIds);
    const oss = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    return users.reduce<UnitInfoDto[]>((pre, cur) => {
      const member = memberMap[cur.id];
      pre.push({
        userId: cur.uuid!,
        uuid: cur.uuid!,
        avatarColor: cur.color!,
        nickName: cur.nikeName!,
        unitId: member?.unitId!,
        isDeleted: member?.isDeleted!,
        type: member?.unitType!,
        name: member ? member.memberName : cur.nikeName!,
        avatar: cur.avatar && !cur.avatar.startsWith('http') ? oss.host + '/' + cur.avatar : cur.avatar,
        isActive: member?.isActive!,
        isNickNameModified: cur.isSocialNameModified !== 0,
        isMemberNameModified: member?.isMemberNameModified!,
      });
      return pre;
    }, []);
  }

  /**
   * @author Zoe Zheng
   * @date 2020/7/24 3:18 PM
   */
  async getUserBaseInfoMapByUserIds(userIds: number[]): Promise<Map<string, INamedUser>> {
    const users = await this.userRepo.selectUserBaseInfoByIds(userIds);
    const userMap = new Map<string, INamedUser>();
    if (users) {
      users.forEach(user => {
        userMap.set(user.id, {
          id: Number(user.id),
          uuid: user.uuid || '',
          avatar: user.avatar || '',
          nikeName: user.nikeName || '',
          isSocialNameModified: user.isSocialNameModified!,
          avatarColor: Number(user.color),
        });
      });
    }
    return userMap;
  }

  async session(cookie: string): Promise<boolean> {
    return await this.restService.hasLogin(cookie);
  }

  async getUserInfoBySpaceId(headers: IAuthHeader, spaceId: string) {
    return await this.restService.getUserInfoBySpaceId(headers, spaceId);
  }

  async getUserIdBySpaceId(headers: IAuthHeader, spaceId: string): Promise<string | undefined> {
    try {
      const userInfo = await this.getUserInfoBySpaceId(headers, spaceId);
      return this.userRepo.selectUserIdByUuid(userInfo.uuid);
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Get self info
   */
  async getMe(headers: IAuthHeader): Promise<IUserBaseInfo> {
    return await this.restService.fetchMe(headers);
  }

  /**
   * Unlogged-in user view on share page
   *
   * @param {string} cookie
   * @returns
   */
  async getMeNullable(cookie: string) {
    const hasLogin = await this.restService.hasLogin(cookie);
    if (hasLogin) {
      return await this.getMe({ cookie });
    }
    return {} as IUserBaseInfo;
  }

  async selectUserBaseInfoByIds(userIds: number[]): Promise<UserBaseInfoDto[]> {
    return await this.userRepo.selectUserBaseInfoByIds(userIds);
  }

  async selectUserBaseInfoByIdsWithDeleted(userIds: string[]): Promise<UserEntity[]> {
    return await this.userRepo.selectUserBaseInfoByIdsWithDeleted(userIds);
  }

  async selectUserBaseInfoById(userId: string): Promise<UserEntity | undefined> {
    return await this.userRepo.selectUserBaseInfoById(userId);
  }
}
