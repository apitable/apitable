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

import { AutomationRunHistoryEntity } from '../entities/automation.run.history.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AutomationRunHistoryEntity)
export class AutomationRunHistoryRepository extends Repository<AutomationRunHistoryEntity> {

  getRunHistoryByRobotId(robotId: string, skip = 0, take = 10) {
    return this.find({
      select: ['taskId', 'robotId', 'createdAt', 'status'],
      where: {
        robotId,
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take
    });
  }

  getRunHistoryByTaskId(taskId: string) {
    return this.findOneOrFail({
      where: {
        taskId,
      },
    });
  }

}
