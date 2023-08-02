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
import { UserEntity } from 'user/entities/user.entity';
import { DeveloperRepository } from '../repositories/developer.repository';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class DeveloperService {
  constructor(
    private readonly developerRepo: DeveloperRepository,
    private readonly userService: UserService,
  ) {
  }

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
      return (await this.userService.selectUserBaseInfoById(entity.userId.toString()))!;
    }
    return null;
  }

}
