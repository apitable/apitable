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

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ResourceRobotDto } from 'automation/dtos/robot.dto';
import { NodeService } from 'node/services/node.service';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';
import { ResourceRobotTriggerDto } from '../dtos/trigger.dto';
import { OFFICIAL_SERVICE_SLUG } from '../events/helpers/trigger.event.helper';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationTriggerRepository } from '../repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from '../repositories/automation.trigger.type.repository';
import { IResourceTriggerGroupVo } from '../vos/resource.trigger.group.vo';

@Injectable()
export class RobotTriggerService {
  constructor(
    // @ts-ignore
    @InjectLogger() private readonly logger: Logger,
    private readonly automationTriggerTypeRepository: AutomationTriggerTypeRepository,
    private readonly automationTriggerRepository: AutomationTriggerRepository,
    private readonly automationServiceRepository: AutomationServiceRepository,
    private readonly automationRobotRepository: AutomationRobotRepository,
    @Inject(forwardRef(() => NodeService))
    private readonly nodeService: NodeService,
  ) {}

  public async getTriggersByResourceAndEventType(resourceId: string, formId: string, endpoint: string): Promise<ResourceRobotTriggerDto[]> {
    const triggerTypeServiceRelDtos = await this.automationTriggerTypeRepository.getTriggerTypeServiceRelByEndPoint(endpoint);
    for (const triggerTypeServiceRel of triggerTypeServiceRelDtos) {
      const officialServiceCount = await this.automationServiceRepository.countOfficialServiceByServiceId(triggerTypeServiceRel.serviceId);
      this.logger.info(
        `get officialServiceCount: ${officialServiceCount} serviceId: ${triggerTypeServiceRel.serviceId} slug: ${OFFICIAL_SERVICE_SLUG}`,
      );
      if (officialServiceCount > 0) {
        // get the special trigger type's robot's triggers.
        return await this._getResourceConditionalRobotTriggers(resourceId, formId, triggerTypeServiceRel.triggerTypeId);
      }
    }
    return [];
  }

  public async getTriggersGroupByResourceId(resourceIds: string[]): Promise<IResourceTriggerGroupVo> {
    const resourceRobotDtos = await this.getActiveRobotsByResourceIds(resourceIds);
    const robotIdToResourceId = resourceRobotDtos.reduce(
      (robotIdToResourceId, item) => {
        robotIdToResourceId[item.robotId] = item.resourceId;
        return robotIdToResourceId;
      },
      {} as { [key: string]: string },
    );
    const triggers = await this.automationTriggerRepository.getAllTriggersByRobotIds(Object.keys(robotIdToResourceId));
    return triggers.reduce((resourceIdToTriggers, item) => {
      const resourceId = item.resourceId || robotIdToResourceId[item.robotId]!;
      resourceIdToTriggers[resourceId] = !resourceIdToTriggers[resourceId] ? [] : resourceIdToTriggers[resourceId]!;
      resourceIdToTriggers[resourceId]!.push(item);
      return resourceIdToTriggers;
    }, {} as IResourceTriggerGroupVo);
  }

  async getActiveRobotsByResourceIds(resourceIds: string[] = []): Promise<ResourceRobotDto[]> {
    const resourceRobotDtos = await this.automationRobotRepository.getActiveRobotsByResourceIds(resourceIds);
    // get resource rel node id
    const nodeRelIds = await this.nodeService.getRelNodeIdsByMainNodeIds(resourceIds);
    resourceIds.push(...nodeRelIds);
    // get resource from trigger
    const triggerResourceDtos = await this.automationTriggerRepository.selectRobotIdAndResourceIdByResourceIds(resourceIds);
    if (triggerResourceDtos.length > 0) {
      const robotIds = new Set(triggerResourceDtos.map((i) => i.robotId));
      // check the robot status
      const activeRobotIds = await this.automationRobotRepository.selectActiveRobotIdsByRobotIds(Array.from(robotIds));
      if (activeRobotIds.length > 0) {
        for (const trigger of triggerResourceDtos) {
          if (activeRobotIds.includes(trigger.robotId)) {
            resourceRobotDtos.push(trigger);
          }
        }
      }
    }
    return resourceRobotDtos;
  }

  async getTriggerByTriggerId(triggerId: string): Promise<ResourceRobotTriggerDto> {
    return (await this.automationTriggerRepository.selectTriggerByTriggerId(triggerId)) as ResourceRobotTriggerDto;
  }

  private async _getResourceConditionalRobotTriggers(resourceId: string, formId: string, triggerTypeId: string) {
    const resourceRobotTriggers: ResourceRobotTriggerDto[] = [];
    // get the datasheet's robots' id.
    const datasheetRobots = await this.automationRobotRepository.selectRobotIdByResourceId(resourceId);
    let robotIds = await this.automationTriggerRepository.getRobotIdsByResourceIdsAndHasInput([formId]);
    robotIds.push(...datasheetRobots.map((i) => i.robotId));
    // filter active robot
    robotIds = await this.automationRobotRepository.selectActiveRobotIdsByRobotIds(robotIds);
    for (const robotId of robotIds) {
      // get the special trigger type's robot's triggers.
      const triggers = await this.automationTriggerRepository.getTriggerByRobotIdAndTriggerTypeId(robotId, triggerTypeId);
      resourceRobotTriggers.push(...triggers);
    }
    return resourceRobotTriggers;
  }
}
