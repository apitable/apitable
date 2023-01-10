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

import { Injectable } from '@nestjs/common';
import { AutomationTriggerTypeRepository } from '../repositories/automation.trigger.type.repository';
import { AutomationTriggerRepository } from '../repositories/automation.trigger.repository';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { ResourceRobotTriggerDto } from '../dtos/resource.robot.trigger.dto';
import { IResourceTriggerGroupVo } from '../vos/resource.trigger.group.vo';

@Injectable()
export class RobotTriggerService {

  constructor(
    private readonly automationTriggerTypeRepository: AutomationTriggerTypeRepository,
    private readonly automationTriggerRepository: AutomationTriggerRepository,
    private readonly automationServiceRepository: AutomationServiceRepository,
    private readonly automationRobotRepository: AutomationRobotRepository,
  ) { }

  public async getTriggersByResourceAndEventType(resourceId: string, endpoint: string): Promise<ResourceRobotTriggerDto[]>{
    const triggerTypeServiceRelDtos = await this.automationTriggerTypeRepository.getTriggerTypeServiceRelByEndPoint(endpoint);
    for (const triggerTypeServiceRel of triggerTypeServiceRelDtos) {
      const officialServiceCount = await this.automationServiceRepository.countOfficialServiceByServiceId(triggerTypeServiceRel.serviceId);
      if(officialServiceCount > 0) {
        // get the special trigger type's robot's triggers.
        return await this._getResourceConditionalRobotTriggers(resourceId, triggerTypeServiceRel.triggerTypeId);
      }
    }
    return [];
  }

  public async getTriggersGroupByResourceId(resourceIds: string[]): Promise<IResourceTriggerGroupVo> {
    const resourceRobotDtos = await this.automationRobotRepository.getActiveRobotsByResourceIds(resourceIds);
    const robotIdToResourceId = resourceRobotDtos.reduce((robotIdToResourceId, item) => {
      robotIdToResourceId[item.robotId] = item.resourceId;
      return robotIdToResourceId;
    }, {} as {[key: string]: string});
    const triggers = await this.automationTriggerRepository.getAllTriggersByRobotIds(Object.keys(robotIdToResourceId));
    return triggers.reduce((resourceIdToTriggers, item) => {
      const resourceId = robotIdToResourceId[item.robotId]!;
      resourceIdToTriggers[resourceId] = !resourceIdToTriggers[resourceId] ? [] : resourceIdToTriggers[resourceId]!;
      resourceIdToTriggers[resourceId]!.push(item);
      return resourceIdToTriggers;
    }, {} as IResourceTriggerGroupVo);
  }

  private async _getResourceConditionalRobotTriggers(resourceId: string, triggerTypeId: string) {
    const resourceRobotTriggers: ResourceRobotTriggerDto[] = [];
    // get the datasheet's robots' id.
    const datasheetRobots = await this.automationRobotRepository.getRobotIdByResourceId(resourceId);
    for (const robot of datasheetRobots) {
      // get the special trigger type's robot's triggers.
      const triggers = await this.automationTriggerRepository.getTriggerByRobotIdAndTriggerTypeId(robot.robotId, triggerTypeId);
      resourceRobotTriggers.push(...triggers);
    }
    return resourceRobotTriggers;
  }
}