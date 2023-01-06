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

import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entities/user.entity';
import { DeveloperRepository } from '../repositories/developer.repository';
import { UnitMemberRepository } from '../../unit/repositories/unit.member.repository';
import { UserRepository } from '../../user/repositories/user.repository';

@Injectable()
export class DeveloperService {
  constructor(
    private readonly developerRepo: DeveloperRepository,
    private readonly userRepo: UserRepository,
    private readonly memberRepo: UnitMemberRepository,
  ) {}

  /**
   * Get User base info by api key
   *
   * @param apiKey unique token on developer platform
   * @return user_id
   * @author Zoe Zheng
   * @date 2020/7/24 3:18 PM
   */
  public async getUserInfoByApiKey(apiKey: string): Promise<UserEntity | null> {
    const entity = await this.developerRepo.selectUserIdByApiKey(apiKey);
    if (entity && entity.userId) {
      return (await this.userRepo.selectUserBaseInfoById(entity.userId.toString()))!;
    }
    return null;
  }

  /**
   * Get space ID list of a user
   *
   * @param userId user ID
   * @return  Promise<string[]>
   * @author Zoe Zheng
   * @date 2020/9/14 5:35 PM
   */
  public async getUserSpaceIds(userId: string): Promise<string[]> {
    return await this.memberRepo.selectSpaceIdsByUserId(userId);
  }
}
