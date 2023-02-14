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

import { AutomationActionTypeEntity } from '../entities/automation.action.type.entity';
import { EntityRepository, In, Repository } from 'typeorm';
import { ActionTypeBaseInfoDto } from '../dtos/action.type.dto';

@EntityRepository(AutomationActionTypeEntity)
export class AutomationActionTypeRepository extends Repository<AutomationActionTypeEntity> {

  public async selectByActionTypeIds(actionTypeIds: string[]): Promise<ActionTypeBaseInfoDto[]> {
    return await this.find({
      select: ['actionTypeId', 'inputJSONSchema', 'outputJSONSchema', 'endpoint', 'serviceId'],
      where: {
        isDeleted: 0,
        actionTypeId: In(actionTypeIds),
      }
    }) as ActionTypeBaseInfoDto[];
  }

}
