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

import { generateRandomString, IRobot } from '@apitable/core';
import { groupBy } from 'lodash';
import { EntityRepository, In, Repository } from 'typeorm';
import { customActionNamePrefix, customActionTypeMap } from '../actions/decorators/automation.action.decorator';
import { AutomationRobotEntity } from '../entities/automation.robot.entity';
import { RobotCreateRo } from '../ros/robot.create.ro';
import { ResourceRobotDto } from '../dtos/resource.robot.dto';

@EntityRepository(AutomationRobotEntity)
export class AutomationRobotRepository extends Repository<AutomationRobotEntity> {

  async getActiveRobotsByResourceIds(resourceIds: string[]): Promise<ResourceRobotDto[]> {
    return await this.find({
      where: {
        resourceId: In(resourceIds),
        isDeleted: false,
        isActive: true
      },
      select: ['robotId', 'resourceId']
    });
  }

  async isResourcesHasRobots(resourceIds: string[]) {
    const robotCount = await this.count(
      {
        where: {
          resourceId: In(resourceIds),
          isDeleted: 0
        },
      },
    );
    return robotCount > 0;
  }

  getResourceIdByRobotId(robotId: string) {
    return this.findOne({ robotId }, { select: ['resourceId'] }).then(res => res?.resourceId);
  }

  getRobotTriggerBaseInfoByIds(robotIds: string[]): Promise<any[]> {
    // todo(itou): replace dynamic sql
    return this.query(`
    SELECT 
      trigger_id triggerId,
      trigger_type_id triggerTypeId,
      robot_id robotId
    FROM
      ${this.manager.connection.options.entityPrefix}automation_trigger
    WHERE
      is_deleted = 0 AND robot_id IN (?)
  `, [robotIds]);
  }

  getRobotTriggerTypeById(triggerTypeId: string): Promise<any> {
    // todo(itou): replace dynamic sql
    return this.query(`
    SELECT 
      input_json_schema inputJsonSchema,
      trigger_type_id triggerTypeId
    FROM
      ${this.manager.connection.options.entityPrefix}automation_trigger_type
    WHERE
      is_deleted = 0 AND trigger_type_id = ?
  `, [triggerTypeId]).then(res => res[0]);
  }

  getRobotTriggerById(robotId: string): Promise<any> {
    // todo(itou): replace dynamic sql
    return this.query(`
    SELECT 
      trigger_id triggerId,
      input,
      trigger_type_id triggerTypeId
    FROM
      ${this.manager.connection.options.entityPrefix}automation_trigger
    WHERE
      is_deleted = 0 AND robot_id = ?
  `, [robotId]).then(res => res[0]);
  }

  getRobotActionsById(robotId: string) {
    // todo(itou): replace dynamic sql
    return this.query(`
    SELECT
      action_id id,
      action_type_id typeId,
      input,
      prev_action_id prevActionId
    FROM
      ${this.manager.connection.options.entityPrefix}automation_action
    WHERE
      is_deleted = 0 AND robot_id = ?
    `, [robotId]);
  }

  async getRobotDetailById(robotId: string): Promise<IRobot> {
    const trigger = await this.getRobotTriggerById(robotId);
    const robot = await this.getRobotById(robotId);
    const res: any = {
      ...robot,
      trigger: trigger || {}
    };

    if (trigger?.triggerTypeId) {
      res.triggerType = await this.getRobotTriggerTypeById(trigger.triggerTypeId);
    }
    return res;
  }

  async getRobotBaseInfoByIds(robotIds: string[]) {
    const robotBaseInfoByIds = {};
    const robots = await this.find({
      where: {
        robotId: In(robotIds),
        isDeleted: 0
      },
      order: {
        createdAt: 'ASC'
      }
    });
    robots.forEach(robot => {
      robotBaseInfoByIds[robot.robotId] = {
        name: robot.name,
        description: robot.description,
        isActive: robot.isActive,
        robotId: robot.robotId,
        nodes: []
      };
    });

    const triggerBaseInfoList = await this.getRobotTriggerBaseInfoByIds(robotIds);

    triggerBaseInfoList.forEach(trigger => {
      robotBaseInfoByIds[trigger.robotId].nodes.push({
        triggerId: trigger.triggerId,
        triggerTypeId: trigger.triggerTypeId,
      });
    });
    // todo(itou): replace dynamic sql
    const actionBaseInfoList = await this.query(
      `
    SELECT
      action_id actionId,
      action_type_id actionTypeId,
      prev_action_id prevActionId,
      robot_id robotId
    FROM
        ${this.manager.connection.options.entityPrefix}automation_action
    WHERE
      is_deleted = 0 AND robot_id IN (?)
    `, [robotIds]);

    Object.entries(groupBy(actionBaseInfoList, 'robotId')).forEach(item => {
      const [robotId, actions] = item;
      // If the bootrapping process of the robot isn't finished, there may be only one trigger that
      // does not have actions, just skip it
      if (actions.length === 0) {
        return;
      }
      const actionsById = actions.reduce((acc, item) => {
        acc[item.actionId] = item;
        return acc;
      }, {});

      const entryActionId = actions.find(item => item.prevActionId === null).actionId;
      Object.keys(actionsById).forEach(item => {
        const action = actionsById[item];
        if (action.prevActionId) {
          actionsById[action.prevActionId].nextActionId = action.actionId;
        }
      });
      const actionSortList = [];
      let entryAction = actionsById[entryActionId];
      actionSortList.push(entryAction);
      while (entryAction.nextActionId) {
        entryAction = actionsById[entryAction.nextActionId];
        actionSortList.push(entryAction);
      }
      robotBaseInfoByIds[robotId].nodes.push(...actionSortList);
    });
    return Object.values(robotBaseInfoByIds);
  }

  async getRobotCountByResourceId(resourceId: string) {
    return await this.count({
      where: {
        resourceId,
        isDeleted: 0
      }
    });
  }

  async getRobotListByResourceId(resourceId: string) {
    const robots = await this.find({
      select: ['robotId'],
      where: {
        resourceId,
        isDeleted: 0
      }
    });

    if (robots.length === 0) {
      return [];
    }

    return await this.getRobotBaseInfoByIds(robots.map(robot => robot.robotId));
  }

  async getRobotById(robotId: string): Promise<IRobot> {
    const trigger = await this.getRobotTriggerById(robotId);
    const triggerId = trigger?.triggerId;
    const triggerTypeId = trigger?.triggerTypeId;
    // todo(itou): replace dynamic sql
    const actions: any[] = await this.query(
      `
    SELECT
      action_id id,
      action_type_id typeId,
      input,
      prev_action_id prevActionId
    FROM
        ${this.manager.connection.options.entityPrefix}automation_action
    WHERE
      is_deleted = 0 AND robot_id = ?
    `, [robotId]);

    const entryActionId = actions.find(item => item.prevActionId === null).id;
    const actionsById = actions.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
    // prev => next
    const actionTypeIds = new Set<string>();
    Object.keys(actionsById).forEach(item => {
      const action = actionsById[item];
      actionTypeIds.add(action.typeId);
      if (action.prevActionId) {
        actionsById[action.prevActionId].nextActionId = action.id;
      }
    });
    // todo(itou): replace dynamic sql
    const actionTypes: any[] = await this.query(`
    SELECT
      action_type_id id,
      input_json_schema inputJSONSchema,
      output_json_schema outputJSONSchema,
      endpoint,
      sv.base_url baseUrl
    FROM
      ${this.manager.connection.options.entityPrefix}automation_action_type actt
      JOIN ${this.manager.connection.options.entityPrefix}automation_service sv ON actt.service_id = sv.service_id
    WHERE
      actt.is_deleted = 0 AND actt.action_type_id IN (?)
    `, [[...actionTypeIds.values()]]);

    actionTypeIds.forEach(actionTypeId => {
      if (actionTypeId.startsWith(customActionNamePrefix)) {
        actionTypes.push(customActionTypeMap.get(actionTypeId));
      }
    });

    const actionTypesById = actionTypes.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    return {
      id: robotId,
      triggerId,
      triggerTypeId,
      entryActionId,
      actionsById,
      actionTypesById
    };
  }

  createRobot(robot: RobotCreateRo, userId: string) {
    const newRobot = this.create({
      resourceId: robot.resourceId,
      // Starting with 'arb', followed by 15 random letters and digits ([a-zA-Z0-9])
      robotId: `arb${generateRandomString(15)}`,
      name: robot.name,
      description: robot.description,
      createdBy: userId,
      updatedBy: userId,
    });
    return this.save(newRobot);
  }

  deleteRobot(robotId: string, userId: string) {
    return this.update({ robotId }, {
      isDeleted: true,
      updatedBy: userId
    });
  }

  activeRobot(robotId: string, userId: string) {
    return this.update({ robotId }, {
      updatedBy: userId,
      isActive: true
    });
  }

  deActiveRobot(robotId: string, userId: string) {
    return this.update({ robotId }, {
      updatedBy: userId,
      isActive: false
    });
  }

  updateRobot(robotId: string, robot: { name?: string, description?: string }, userId: string) {
    return this.update({ robotId }, { ...robot, updatedBy: userId });
  }

  public getRobotIdByResourceId(resourceId: string): Promise<Pick<AutomationRobotEntity, 'robotId'>[]> {
    return this.find({
      select: ['robotId'],
      where: {
        isActive: 1,
        isDeleted: 0,
        resourceId: resourceId,
      }
    });
  }
}
