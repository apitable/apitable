import { AutomationTriggerEntity } from '../entities/automation.trigger.entity';
import { EntityRepository, In, IsNull, Not, Repository } from 'typeorm';
import { TriggerCreateRo } from '../ros/trigger.create.ro';
import { generateRandomString } from '@apitable/core';

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

  getTriggersByResourceAndTriggerTypeId(datasheetId: string, triggerTypeId: string): Promise<any[]> {
    return this.query(
      `
    SELECT
      trigger_id triggerId,
      trigger_type_id triggerTypeId,
      input,
      vat.robot_id robotId
    FROM
      vika_automation_trigger vat
      JOIN vika_automation_robot rbt ON rbt.resource_id = ?
        AND rbt.robot_id = vat.robot_id AND rbt.is_active = 1 AND rbt.is_deleted = 0
    WHERE
      vat.is_deleted = 0 AND vat.trigger_type_id = ?
        `,
      [datasheetId, triggerTypeId],
    );
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
    // clean trigger input when type changed
    return this.update({ triggerId }, { triggerTypeId, input: null, updatedBy: userId });
  }
}
