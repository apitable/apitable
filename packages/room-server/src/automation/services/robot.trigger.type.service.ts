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
import { IServiceSlugTriggerTypeVo } from '../vos/service.slug.trigger.type.vo';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { getTypeByItem } from '../utils';

@Injectable()
export class RobotTriggerTypeService {

  constructor(
    private readonly automationTriggerTypeRepository: AutomationTriggerTypeRepository,
    private readonly automationServiceRepository: AutomationServiceRepository,
  ) {
  }

  public async getServiceSlugToTriggerTypeId(endpoints: string[], serviceSlug: string): Promise<IServiceSlugTriggerTypeVo> {
    const triggerTypeServiceRelDtos = await this.automationTriggerTypeRepository.getTriggerTypeServiceRelByEndPoints(endpoints);
    const triggerTypes: {
      triggerTypeId: string,
      endpoint: string,
      serviceSlug: string,
    }[] = [];
    for (const triggerTypeServiceRelDto of triggerTypeServiceRelDtos) {
      const number = await this.automationServiceRepository.countServiceByServiceIdAndSlug(triggerTypeServiceRelDto.serviceId, serviceSlug);
      if (number > 0) {
        triggerTypes.push({
          triggerTypeId: triggerTypeServiceRelDto.triggerTypeId,
          endpoint: triggerTypeServiceRelDto.endpoint!,
          serviceSlug: serviceSlug,
        });
      }
    }
    return triggerTypes.reduce((serviceSlugToTriggerTypeId, item)=> {
      const triggerSlug = `${item.endpoint}@${item.serviceSlug}`;
      serviceSlugToTriggerTypeId[triggerSlug] = item.triggerTypeId;
      return serviceSlugToTriggerTypeId;
    }, {} as IServiceSlugTriggerTypeVo);
  }

  /**
   * Get all the trigger types info.
   *
   * There is an optimizing place: cache the result in memory.
   * @param lang  the triggers' language version
   */
  public async getTriggerType(lang = 'zh') {
    const triggerTypes = await this.automationTriggerTypeRepository.selectAllTriggerType();

    const serviceIds = new Set<string>();
    triggerTypes.forEach(triggerType => serviceIds.add(triggerType.serviceId));
    const services = await this.automationServiceRepository.selectServiceByServiceIds([...serviceIds]);
    const serviceIdToServiceMap = services.reduce((acc, item) => {
      acc[item.serviceId] = item;
      return acc;
    }, {});

    const triggerTypeDetails = triggerTypes.map(triggerType => {
      const service = serviceIdToServiceMap[triggerType.serviceId];
      return {
        ...triggerType,
        inputJsonSchema: triggerType.inputJSONSchema,
        outputJsonSchema: triggerType.outputJSONSchema,
        serviceName: service.name,
        serviceLogo: service.logo,
        serviceSlug: service.slug,
        serviceI18n: service.i18n,
      };
    });

    return triggerTypeDetails.map(triggerType => {
      return getTypeByItem(triggerType, lang, 'trigger');
    });
  }
}