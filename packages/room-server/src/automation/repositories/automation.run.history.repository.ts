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

import { IDPrefix, IRobotTask } from '@apitable/core';
import { RunHistoryStatusEnum } from 'shared/enums/automation.enum';
import { EntityRepository, In, Repository } from 'typeorm';
import { AutomationRunHistoryEntity } from '../entities/automation.run.history.entity';

@EntityRepository(AutomationRunHistoryEntity)
export class AutomationRunHistoryRepository extends Repository<AutomationRunHistoryEntity> {
  getRunHistoryByRobotId(robotId: string, skip = 0, take = 10) {
    return this.find({
      select: ['taskId', 'robotId', 'createdAt', 'status'],
      where: {
        robotId,
        status: In([RunHistoryStatusEnum.RUNNING, RunHistoryStatusEnum.SUCCESS, RunHistoryStatusEnum.FAILED]),
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
    });
  }

  getRunHistoryByTaskId(taskId: string) {
    return this.findOneOrFail({
      where: {
        taskId,
      },
    }).then((result) => {
      if (result.data && result.data.hasOwnProperty('executedNodeIds')) {
        const executedNodeIds = result.data['executedNodeIds'] as string[];
        if (executedNodeIds.length) {
          const nodeIds = [];
          let executedTriggerId;
          for (const nodeId of executedNodeIds) {
            if (nodeId.startsWith(IDPrefix.AutomationTrigger) && !executedTriggerId) {
              executedTriggerId = nodeId;
              nodeIds.push(nodeId);
            }
            if (nodeId.startsWith(IDPrefix.AutomationAction)) {
              nodeIds.push(nodeId);
            }
          }
          result.data['executedNodeIds'] = nodeIds;
        }
      }
      return result;
    });
  }

  selectContextByTaskIdAndTriggerId(taskId: string, triggerId: string): Promise<IRobotTask | undefined> {
    return this.createQueryBuilder('rhs')
      .select('robot_id', 'robotId')
      .addSelect('task_id', 'taskId')
      .addSelect('status', 'status')
      .addSelect("JSON_EXTRACT(rhs.data, CONCAT('$.', :triggerId, '.input'))", 'triggerInput')
      .addSelect("JSON_EXTRACT(rhs.data, CONCAT('$.', :triggerId, '.output'))", 'triggerOutput')
      .where('rhs.task_id = :taskId', { taskId })
      .setParameter('triggerId', triggerId)
      .getRawOne<IRobotTask>();
  }

  async updateStatusByTaskId(taskId: string, status: RunHistoryStatusEnum): Promise<number | undefined> {
    const r = await this.update({ taskId }, { status });
    return r.affected;
  }

  async selectRobotIdByTaskId(taskId: string): Promise<string | undefined> {
    const result = await this.findOne({ select: ['robotId'], where: { taskId } });
    return result?.robotId;
  }

  async selectStatusByTaskId(taskId: string): Promise<number | undefined> {
    return await this.findOne({ select: ['status'], where: { taskId } }).then((result) => result?.status);
  }
}
