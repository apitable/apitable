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

import { AutomationActionEntity } from '../entities/automation.action.entity';
import { EntityRepository, getManager, Repository } from 'typeorm';
import { generateRandomString } from '@apitable/core';
import { ActionCreateRo } from '../ros/action.create.ro';

@EntityRepository(AutomationActionEntity)
export class AutomationActionRepository extends Repository<AutomationActionEntity> {

  createAction(action: ActionCreateRo, userId: string) {
    const newAction = this.create({
      actionId: `aac${generateRandomString(15)}`,
      actionTypeId: action.actionTypeId,
      robotId: action.robotId,
      input: action.input,
      prevActionId: action.prevActionId,
      createdBy: userId,
      updatedBy: userId,
    });
    return this.save(newAction);
  }

  async deleteRobotActionByActionId(actionId: string, userId: string) {
    // todo(itou): replace dynamic sql
    // Finds the previous and the next node of the current node, then
    // currentNode.nextNode.prevNode <- currentNode.prevNode
    const thisAction = await this.query(
      `
    SELECT
      robot_id, prev_action_id
    FROM
      ${this.manager.connection.options.entityPrefix}automation_action
    WHERE
      is_deleted = 0 AND action_id = ?
    `, [actionId]);
    const robotId = thisAction[0].robot_id;
    const prevActionId = thisAction[0].prev_action_id;

    // update together
    await getManager().transaction(async transactionalEntityManager => {
      // update `prev_action_id` of the next node to `prev_action_id` of the current node
      await transactionalEntityManager.query(
        `
      UPDATE
        ${this.manager.connection.options.entityPrefix}automation_action
      SET
        prev_action_id = ?,
        updated_by = ?
      WHERE
        robot_id = ? AND prev_action_id = ? AND is_deleted = 0
      `, [prevActionId, userId, robotId, actionId]);

      await transactionalEntityManager.query(`
    UPDATE
      ${this.manager.connection.options.entityPrefix}automation_action
    SET
      is_deleted = 1,
      updated_by = ?
    WHERE action_id = ?
    `, [userId, actionId]);
    });
    return true;
  }

  updateActionInput(actionId: string, input: object, userId: string) {
    return this.update({ actionId }, { input, updatedBy: userId });
  }

  changeActionTypeId(actionId: string, actionTypeId: string, userId: string) {
    // When switching action prototype, clear input
    return this.update({ actionId }, { actionTypeId, input: undefined, updatedBy: userId });
  }
}
