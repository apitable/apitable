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

import { generateRandomString } from '@apitable/core';
import { ResourceRobotDto } from 'automation/dtos/robot.dto';
import { EntityRepository, In, IsNull, Not, Repository } from 'typeorm';
import { ResourceRobotTriggerDto, RobotTriggerBaseInfoDto, RobotTriggerInfoDto } from '../dtos/trigger.dto';
import { AutomationTriggerEntity } from '../entities/automation.trigger.entity';
import { TriggerCreateRo } from '../ros/trigger.create.ro';

@EntityRepository(AutomationTriggerEntity)
export class AutomationTriggerRepository extends Repository<AutomationTriggerEntity> {
  getAllTriggersByRobotIds(robotIds: string[]): Promise<AutomationTriggerEntity[]> {
    return this.find({
      where: {
        robotId: In(robotIds),
        input: Not(IsNull()),
        isDeleted: false,
      },
    });
  }

  createTrigger(trigger: TriggerCreateRo, userId: string, resourceId?: string): Promise<AutomationTriggerEntity> {
    const newTrigger = this.create({
      triggerId: `atr${generateRandomString(15)}`,
      triggerTypeId: trigger.triggerTypeId,
      robotId: trigger.robotId,
      createdBy: userId,
      updatedBy: userId,
      input: trigger.input,
      resourceId,
    });
    return this.save(newTrigger);
  }

  updateTriggerInput(triggerId: string, input: object, userId: string, resourceId?: string) {
    return this.update({ triggerId }, { input, updatedBy: userId, resourceId });
  }

  changeTriggerTypeId(triggerId: string, triggerTypeId: string, userId: string) {
    // Clear input when switching trigger prototype
    return this.update({ triggerId }, { triggerTypeId, input: undefined, updatedBy: userId });
  }

  public getTriggerByRobotIdAndTriggerTypeId(robotId: string, triggerTypeId: string): Promise<ResourceRobotTriggerDto[]> {
    return this.find({
      select: ['triggerId', 'triggerTypeId', 'input', 'robotId'],
      where: {
        robotId: robotId,
        triggerTypeId: triggerTypeId,
        isDeleted: 0,
      },
    });
  }

  public async selectTriggerInfoByRobotId(robotId: string): Promise<RobotTriggerInfoDto | undefined> {
    return await this.findOne({
      select: ['triggerId', 'input', 'triggerTypeId'],
      where: {
        isDeleted: 0,
        robotId: robotId,
        input: Not(IsNull()),
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  public async selectTriggerInfoByTriggerId(triggerId: string): Promise<RobotTriggerInfoDto | undefined> {
    return await this.findOne({
      select: ['triggerId', 'input', 'triggerTypeId'],
      where: {
        isDeleted: 0,
        triggerId: triggerId,
      },
    });
  }

  public async selectTriggerBaseInfosByRobotIds(robotIds: string[]): Promise<RobotTriggerBaseInfoDto[]> {
    return await this.find({
      select: ['triggerId', 'triggerTypeId', 'robotId'],
      where: {
        isDeleted: 0,
        robotId: In(robotIds),
      },
    });
  }

  async getRobotIdsByResourceIdsAndHasInput(resourceIds: string[]): Promise<string[]> {
    const results = await this.find({
      select: ['robotId'],
      where: {
        resourceId: In(resourceIds),
        input: Not(IsNull()),
        isDeleted: false,
      },
    });
    return results.filter((i) => i.robotId).map((result) => result.robotId);
  }

  async selectRobotIdAndResourceIdByResourceIds(resourceIds: string[]): Promise<ResourceRobotDto[]> {
    const results = await this.find({
      select: ['robotId', 'resourceId'],
      where: {
        resourceId: In(resourceIds),
        input: Not(IsNull()),
        isDeleted: false,
      },
    });
    return results as ResourceRobotDto[];
  }

  async selectTriggerByTriggerId(triggerId: string): Promise<AutomationTriggerEntity | undefined> {
    return await this.findOne({
      select: ['robotId', 'triggerId', 'triggerTypeId', 'input', 'resourceId'],
      where: { triggerId, isDeleted: 0 },
    });
  }

  async selectResourceIdCountByRobotId(robotId: string): Promise<number> {
    return await this.count({
      where: { robotId, isDeleted: 0, resourceId: Not('') },
    });
  }

  public async selectTriggerInfosByRobotId(robotId: string): Promise<AutomationTriggerEntity[]> {
    return await this.find({
      select: ['triggerId', 'input', 'triggerTypeId', 'resourceId'],
      where: {
        isDeleted: 0,
        robotId: robotId,
      },
    });
  }
}
