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

import { EntityRepository, In, Repository } from 'typeorm';
import { RobotActionBaseInfoDto, RobotActionInfoDto, RobotRelDto } from '../dtos/action.dto';
import { AutomationActionEntity } from '../entities/automation.action.entity';
import { ActionCreateRo } from '../ros/action.create.ro';

@EntityRepository(AutomationActionEntity)
export class AutomationActionRepository extends Repository<AutomationActionEntity> {

  createAction(actionId: string, action: ActionCreateRo, userId: string) {
    const newAction = this.create({
      actionId,
      actionTypeId: action.actionTypeId,
      robotId: action.robotId,
      input: action.input,
      prevActionId: action.prevActionId,
      createdBy: userId,
      updatedBy: userId,
    });
    return this.save(newAction);
  }

  async selectRobotRelByActionId(actionId: string): Promise<RobotRelDto> {
    return await this.findOneOrFail({
      select: [
        'robotId',
        'prevActionId',
      ],
      where: {
        actionId,
        isDeleted: 0,
      }
    });
  }

  async updateRobotPrevActionIdByOldPrevActionId(userId: string, robotId: string, prevActionId: string | undefined, oldPrevActionId: string) {
    return await this.update({
      robotId,
      prevActionId: oldPrevActionId,
      isDeleted: false,
    }, {
      prevActionId,
      updatedBy: userId,
    });
  }

  async deleteActionByActionId(userId: string, actionId: string) {
    return await this.update({
      actionId,
    }, {
      updatedBy: userId,
      isDeleted: true,
    });
  }

  updateActionInput(actionId: string, input: object, userId: string) {
    return this.update({ actionId }, { input, updatedBy: userId });
  }

  changeActionTypeId(actionId: string, actionTypeId: string, userId: string) {
    // When switching action prototype, clear input
    return this.update({ actionId }, { actionTypeId, input: undefined, updatedBy: userId });
  }

  public async selectActionInfosByRobotId(robotId: string): Promise<RobotActionInfoDto[]> {
    return await this.find({
      select: ['actionId', 'actionTypeId', 'prevActionId', 'input'],
      where: {
        isDeleted: 0,
        robotId: robotId,
      }
    }) as RobotActionInfoDto[];
  }

  public async selectActionBaseInfosByRobotIds(robotIds: string[]): Promise<RobotActionBaseInfoDto[]> {
    return await this.find({
      select: ['actionId', 'actionTypeId', 'prevActionId', 'robotId'],
      where: {
        isDeleted: 0,
        robotId: In(robotIds),
      }
    }) as RobotActionBaseInfoDto[];
  }

  public async selectCountByRobotId(robotId: string): Promise<number> {
    return await this.createQueryBuilder()
      .where('robot_id = :robotId', { robotId })
      .andWhere('is_deleted = 0')
      .andWhere('prev_action_id is not null')
      .getCount();
  }
}
