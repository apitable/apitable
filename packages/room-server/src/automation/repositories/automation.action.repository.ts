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
    // find prev and next node of current, and set next node's prev node to current node's prev node.
    const thisAction = await this.query(
      `
    SELECT
      robot_id, prev_action_id
    FROM
      vika_automation_action
    WHERE
      is_deleted = 0 AND action_id = ?
    `, [actionId]);
    const robotId = thisAction[0].robot_id;
    const prevActionId = thisAction[0].prev_action_id;
    
    // transaction to update prev and next node
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.query(
        `
      UPDATE
        vika_automation_action
      SET
        prev_action_id = ?,
        updated_by = ?
      WHERE
        robot_id = ? AND prev_action_id = ? AND is_deleted = 0
      `, [prevActionId, userId, robotId, actionId]);

      await transactionalEntityManager.query(`
    UPDATE
      vika_automation_action
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
    // clean action input when changing action type
    return this.update({ actionId }, { actionTypeId, input: null, updatedBy: userId });
  }
}
