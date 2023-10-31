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

import { IActionType, IRobot } from '@apitable/core';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AutomationRobotRepository } from 'automation/repositories/automation.robot.repository';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { groupBy } from 'lodash';
import { InjectLogger } from 'shared/common';
import { CommonException, ServerException } from 'shared/exception';
import { Logger } from 'winston';
import { customActionNamePrefix, customActionTypeMap } from '../actions/decorators/automation.action.decorator';
import { RobotActionBaseInfoDto, RobotActionInfoDto } from '../dtos/action.dto';
import { TriggerTriggerTypeRelDto } from '../dtos/trigger.dto';
import { AutomationActionEntity } from '../entities/automation.action.entity';
import { AutomationActionRepository } from '../repositories/automation.action.repository';
import { AutomationActionTypeRepository } from '../repositories/automation.action.type.repository';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationTriggerTypeRepository } from '../repositories/automation.trigger.type.repository';
import { RobotBaseInfoVo } from '../vos/robot.base.info.vo';
import { RobotDetailVo } from '../vos/robot.detail.vo';

@Injectable()
export class RobotRobotService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    @Inject(forwardRef(() => AutomationServiceRepository))
    private readonly automationServiceRepository: AutomationServiceRepository,
    private readonly automationRobotRepository: AutomationRobotRepository,
    private readonly automationTriggerRepository: AutomationTriggerRepository,
    private readonly automationTriggerTypeRepository: AutomationTriggerTypeRepository,
    private readonly automationActionRepository: AutomationActionRepository,
    private readonly automationActionTypeRepository: AutomationActionTypeRepository,
  ) {}

  /**
   * Get the resource's robots info.
   *
   * @param   resourceId  the resource id
   * @return  RobotBaseInfoVo[]
   */
  public async getRobotListByResourceId(resourceId: string): Promise<RobotBaseInfoVo[]> {
    // get the resource's robots' id
    const robotIds = await this.automationRobotRepository.selectRobotIdsByResourceId(resourceId);

    if (robotIds.length === 0) {
      return [];
    }
    // call getRobotBaseInfoByIds
    return await this.getRobotBaseInfoByIds(robotIds.map((robotId) => robotId.robotId));
  }

  public async getRobotBaseInfoByIds(robotIds: string[]): Promise<RobotBaseInfoVo[]> {
    const robotBaseInfoByIds: { [key: string]: RobotBaseInfoVo } = {};

    // 1. Get the robot's base info.
    const robots = await this.automationRobotRepository.selectRobotBaseInfoDtoByRobotIds(robotIds);
    robots.forEach((robot) => {
      robotBaseInfoByIds[robot.robotId] = {
        name: robot.name,
        description: robot.description,
        isActive: robot.isActive,
        robotId: robot.robotId,
        nodes: [] as (TriggerTriggerTypeRelDto | RobotActionBaseInfoDto)[],
      };
    });

    // 2. Get the robot's triggers' info.
    const triggerBaseInfoList = await this.automationTriggerRepository.selectTriggerBaseInfosByRobotIds(robotIds);
    triggerBaseInfoList.forEach((trigger) => {
      // Notice: If the robot id no map a robot, it means dirty data.
      robotBaseInfoByIds[trigger.robotId]?.nodes.push({
        triggerId: trigger.triggerId,
        triggerTypeId: trigger.triggerTypeId,
      });
    });

    // 3. Get the robot's actions' info.
    const actionBaseInfoList = await this.automationActionRepository.selectActionBaseInfosByRobotIds(robotIds);
    Object.entries(groupBy(actionBaseInfoList, 'robotId')).forEach((item) => {
      const [robotId, actions] = item;
      if (!actions || actions.length === 0) {
        // the process of the robot not config action.
        return;
      }
      const sortActionList = this.getRobotSortActionList(actions);
      // Notice: If the robot id no map a robot, it means dirty data.
      robotBaseInfoByIds[robotId]?.nodes.push(...sortActionList);
    });

    return Object.values(robotBaseInfoByIds);
  }

  /**
   * The function {@link getRobotById} is called, please see it's comment to understand details.
   *
   * @param   robotId   the robot id
   * @return  RobotDetailVo
   */
  public async getRobotDetailById(robotId: string): Promise<RobotDetailVo> {
    // Get type IRobot object by robotId.
    const robot = await this.getRobotById(robotId);

    // Find robot's trigger and triggerType.
    // The trigger must no be undefined, because function `getRobotById` have checked.
    const trigger = await this.automationTriggerRepository.selectTriggerInfoByRobotId(robotId);
    const result: RobotDetailVo = {
      ...robot,
      trigger: trigger || {},
    };

    // The triggerTypeId must exist. if no, this trigger is dirty data.
    if (trigger?.triggerTypeId) {
      result.triggerType = await this.automationTriggerTypeRepository.selectInputJsonSchemaById(trigger.triggerTypeId);
    }

    return result;
  }

  /**
   * Get the iRobot object. It's properties see IRobot Interface.
   *
   * Call this method, You should make sure the robot configuration is correct. If not, it will throw {@link CommonException.ROBOT_FORM_CHECK_ERROR}.
   *
   * When call this method?
   * 1. When robot trigger, call it to get the robot info.
   * 2. When active robot, call it to get the robot details info.
   * 3. When request `get /robots/:robotId` path.
   * @param   robotId   the robot id
   * @param triggerId the trigger id
   * @return  IRobot
   * @throws  CommonException.ROBOT_FORM_CHECK_ERROR
   */
  public async getRobotById(robotId: string, triggerId?: string): Promise<IRobot> {
    const trigger = triggerId
      ? await this.automationTriggerRepository.selectTriggerInfoByTriggerId(triggerId)
      : await this.automationTriggerRepository.selectTriggerInfoByRobotId(robotId);
    if (!trigger?.triggerId || !trigger?.triggerTypeId) {
      this.logger.info(
        `The robot [${robotId}] configuration info don't meet conditional: ` +
          `triggerId: ${trigger?.triggerId}, triggerTypeId: ${trigger?.triggerTypeId}`,
      );
      throw new ServerException(CommonException.ROBOT_FORM_CHECK_ERROR);
    }

    // The actions may be empty list.
    const actions = await this.automationActionRepository.selectActionInfosByRobotId(robotId);

    // If the entry action id is undefined, check there.
    const entryActionId = actions.find((item) => item.prevActionId === null)?.actionId;
    if (!entryActionId) {
      this.logger.info(`The robot [${robotId}] configuration info don't meet conditional: entryActionId: ${entryActionId}`);
      throw new ServerException(CommonException.ROBOT_FORM_CHECK_ERROR);
    }

    const actionIdToActionMap = RobotRobotService.getActionIdToActionMap(actions);
    // The iRobot interface's action's action id named id, and action type id named type id.
    actions.forEach((action) => {
      action.id = action.actionId;
      action.typeId = action.actionTypeId;
    });

    this.actionAddNextActionId(actionIdToActionMap);
    const actionTypeIdToActionTypeMap = await this.getActionTypeIdToActionTypeMap(actions);

    return {
      id: robotId,
      triggerId: trigger.triggerId,
      triggerTypeId: trigger.triggerTypeId,
      entryActionId,
      actionsById: actionIdToActionMap,
      actionTypesById: actionTypeIdToActionTypeMap,
    };
  }

  private static getActionIdToActionMap(actions: Pick<AutomationActionEntity, 'actionId'>[]) {
    return actions.reduce((acc, item) => {
      acc[item.actionId] = item;
      return acc;
    }, {});
  }

  private static sortRobotActions(actions: RobotActionBaseInfoDto[], actionIdToActionMap: {}): RobotActionBaseInfoDto[] {
    const actionSortList = [];

    const entryActionId = actions.find((item) => item.prevActionId === null)?.actionId;

    const entryAction = actionIdToActionMap[entryActionId!];
    actionSortList.push(entryAction);
    let action = entryAction;
    while (action && action.nextActionId) {
      action = actionIdToActionMap[action.nextActionId];
      actionSortList.push(action);
    }
    return actionSortList;
  }

  /**
   * Make the action's prev action's next action link it.
   * @param actionIdToActionMap the map: key is action id, value is action
   */
  private actionAddNextActionId(actionIdToActionMap: {}) {
    Object.keys(actionIdToActionMap).forEach((item) => {
      const action = actionIdToActionMap[item]!;
      if (action.prevActionId && actionIdToActionMap[action.prevActionId]) {
        actionIdToActionMap[action.prevActionId].nextActionId = action.actionId;
      }
    });
  }

  private getRobotSortActionList(actions: RobotActionBaseInfoDto[]): RobotActionBaseInfoDto[] {
    const actionIdToActionMap = RobotRobotService.getActionIdToActionMap(actions);

    this.actionAddNextActionId(actionIdToActionMap);

    // If the actions sequence is error, there a good place to find exception.
    // Please log the actionIdToActionMap to check the action nodes relation.

    return RobotRobotService.sortRobotActions(actions, actionIdToActionMap);
  }

  /**
   * Find all the action types which catch service' base url in actions.
   * Then return the map: key is action type id, value is action types' info.
   *
   * notice: the action types in tow place: db and app memory(customActionTypeMap).
   * The action type id prefix is aat in db and caat in app memory.
   *
   * @param   actions   the actions
   * @return  {[actionTypeId: string]: IActionType}
   * @private
   */
  private async getActionTypeIdToActionTypeMap(actions: RobotActionInfoDto[]): Promise<{ [key: string]: IActionType }> {
    const actionTypeIds = new Set<string>();
    // Get the unique action type ids.
    actions.forEach((action) => actionTypeIds.add(action.actionTypeId!));
    const actionTypes = await this.automationActionTypeRepository.selectByActionTypeIds([...actionTypeIds.values()]);

    const serviceIds = new Set<string>();
    // Get the unique service id.
    actionTypes.forEach((actionType) => serviceIds.add(actionType.serviceId));
    const services = await this.automationServiceRepository.selectBaseUrlsByServiceIds([...serviceIds.values()]);
    const serviceIdToBaseUrlMap = services.reduce((acc, item) => {
      acc[item.serviceId] = item.baseUrl;
      return acc;
    }, {});

    // the db's action type
    const iActionTypes: IActionType[] = actionTypes.reduce((acc, item) => {
      acc.push({
        id: item.actionTypeId,
        inputJSONSchema: item.inputJSONSchema,
        outputJSONSchema: item.outputJSONSchema,
        endpoint: item.endpoint,
        baseUrl: serviceIdToBaseUrlMap[item.serviceId],
      });
      return acc;
    }, [] as IActionType[]);

    // the hot plug's action type
    actionTypeIds.forEach((actionTypeId) => {
      if (actionTypeId.startsWith(customActionNamePrefix)) {
        iActionTypes.push(customActionTypeMap.get(actionTypeId)!);
      }
    });

    return iActionTypes.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }
}
