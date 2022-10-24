import { generateRandomString, IRobot } from '@apitable/core';
import { AutomationRobotEntity } from 'entities/automation.robot.entity';
import { groupBy } from 'lodash';
import { RobotCreateRo } from 'model/ro/automation/robot.create.ro';
import { EntityRepository, Repository, In } from 'typeorm';

@EntityRepository(AutomationRobotEntity)
export class AutomationRobotRepository extends Repository<AutomationRobotEntity> {

  async getActiveRobotsByResourceIds(resourceIds: string[]) {
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
    return this.findOne({ robotId }, { select: ['resourceId'] }).then(res => res.resourceId);
  }

  getRobotTriggerBaseInfoByIds(robotIds: string[]) {
    return this.query(`
    SELECT 
      trigger_id triggerId,
      trigger_type_id triggerTypeId,
      robot_id robotId
    FROM
      vika_automation_trigger
    WHERE
      is_deleted = 0 AND robot_id IN (?)
  `, [robotIds]);
  }

  getRobotTriggerTypeById(triggerTypeId: string): Promise<any> {
    return this.query(`
    SELECT 
      input_json_schema inputJsonSchema,
      trigger_type_id triggerTypeId
    FROM
      vika_automation_trigger_type
    WHERE
      is_deleted = 0 AND trigger_type_id = ?
  `, [triggerTypeId]).then(res => res[0]);
  }

  getRobotTriggerById(robotId: string): Promise<any> {
    return this.query(`
    SELECT 
      trigger_id triggerId,
      input,
      trigger_type_id triggerTypeId
    FROM
      vika_automation_trigger
    WHERE
      is_deleted = 0 AND robot_id = ?
  `, [robotId]).then(res => res[0]);
  }

  getRobotActionsById(robotId: string) {
    return this.query(`
    SELECT
      action_id id,
      action_type_id typeId,
      input,
      prev_action_id prevActionId
    FROM
      vika_automation_action
    WHERE
      is_deleted = 0 AND robot_id = ?
    `, [robotId]);
  }

  async getRobotTriggerTypes() {
    const triggerTypes = await this.query(`
    SELECT tt.trigger_type_id triggerTypeId,
        tt.name,
        tt.description,
        tt.endpoint,
        tt.i18n,
        tt.input_json_schema inputJsonSchema,
        tt.output_json_schema outputJsonSchema,
        s.service_id serviceId,
        s.name As serviceName,
        s.logo as serviceLogo,
        s.slug AS serviceSlug,
        s.i18n as serviceI18n
    FROM vika_automation_trigger_type tt
          JOIN vika_automation_service s ON s.service_id = tt.service_id
    WHERE tt.is_deleted = 0
    `);
    return triggerTypes;
  }

  async getRobotActionTypes() {
    const actionTypes = await this.query(`
    SELECT
      aat.action_type_id actionTypeId,
      aat.name,
      aat.description,
      aat.endpoint,
      aat.i18n,
      aat.input_json_schema inputJsonSchema,
      aat.output_json_schema outputJsonSchema,
      s.service_id serviceId,
      s.name AS serviceName,
      s.logo As serviceLogo,
      s.slug AS serviceSlug,
      s.i18n As serviceI18n
    FROM vika_automation_action_type aat
          JOIN vika_automation_service s ON s.service_id = aat.service_id
    WHERE aat.is_deleted = 0
    `);
    return actionTypes;
  }
  async getRobotDetailById(robotId: string): Promise<IRobot> {
    const trigger = await this.getRobotTriggerById(robotId);
    const robot = await this.getRobotById(robotId);
    const res: any = {
      ...robot,
      trigger: trigger || {}
    };

    if (trigger?.triggerTypeId) {
      const triggerType = await this.getRobotTriggerTypeById(trigger.triggerTypeId);
      res.triggerType = triggerType;
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

    const actionBaseInfoList = await this.query(
      `
    SELECT
      action_id actionId,
      action_type_id actionTypeId,
      prev_action_id prevActionId,
      robot_id robotId
    FROM
      vika_automation_action
    WHERE
      is_deleted = 0 AND robot_id IN (?)
    `, [robotIds]);

    Object.entries(groupBy(actionBaseInfoList, 'robotId')).forEach(item => {
      const [robotId, actions] = item;
      // 如果机器人的引导创建流程没走完，存在只有一个 trigger 没有 actions 的情况。直接跳过
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
    const actions = await this.query(
      `
    SELECT
      action_id id,
      action_type_id typeId,
      input,
      prev_action_id prevActionId
    FROM
      vika_automation_action
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

    const actionTypes = await this.query(`
    SELECT
      action_type_id id,
      input_json_schema inputJSONSchema,
      output_json_schema outputJSONSchema,
      endpoint,
      sv.base_url baseUrl
    FROM
      vika_automation_action_type actt
      JOIN vika_automation_service sv ON actt.service_id = sv.service_id
    WHERE
      actt.is_deleted = 0 AND actt.action_type_id IN (?)
    `, [[...actionTypeIds.values()]]);

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
      // arb 开头 15 位[a-zA-Z] 随机字符
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
}
