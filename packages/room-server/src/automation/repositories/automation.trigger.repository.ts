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

import { AutomationTriggerEntity } from '../entities/automation.trigger.entity';
import { EntityRepository, In, IsNull, Not, Repository } from 'typeorm';
import { TriggerCreateRo } from '../ros/trigger.create.ro';
import { generateRandomString } from '@apitable/core';
import { ResourceRobotTriggerDto, RobotTriggerBaseInfoDto, RobotTriggerInfoDto } from '../dtos/trigger.dto';

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

  createTrigger(trigger: TriggerCreateRo, userId: string): Promise<AutomationTriggerEntity> {
    const newTrigger = this.create({
      triggerId: `atr${generateRandomString(15)}`,
      triggerTypeId: trigger.triggerTypeId,
      robotId: trigger.robotId,
      createdBy: userId,
      updatedBy: userId,
      input: trigger.input,
    });
    return this.save(newTrigger);
  }

  updateTriggerInput(triggerId: string, input: object, userId: string) {
    return this.update({ triggerId }, { input, updatedBy: userId });
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
      }
    });
  }

  public async selectTriggerInfoByRobotId(robotId: string): Promise<RobotTriggerInfoDto | undefined> {
    return await this.findOne({
      select: ['triggerId', 'input', 'triggerTypeId'],
      where: {
        isDeleted: 0,
        robotId: robotId
      }
    });
  }

  public async selectTriggerBaseInfosByRobotIds(robotIds: string[]): Promise<RobotTriggerBaseInfoDto[]> {
    return await this.find({
      select: ['triggerId', 'triggerTypeId', 'robotId'],
      where: {
        isDeleted: 0,
        robotId: In(robotIds),
      }
    });
  }
}
