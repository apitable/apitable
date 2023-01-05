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

import { ActionTypeCreateRo } from '../ros/action.type.create.ro';
import { IUserBaseInfo } from '../../shared/interfaces';
import { AutomationActionTypeRepository } from '../repositories/automation.action.type.repository';
import { customActionTypeMetas } from '../actions/decorators/automation.action.decorator';
import { ActionTypeUpdateRo } from '../ros/action.type.update.ro';
import { getTypeByItem } from '../utils';
import { AutomationActionTypeEntity } from '../entities/automation.action.type.entity';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationServiceEntity } from '../entities/automation.service.entity';
import { ActionTypeDetailVo } from '../vos/action.type.detail.vo';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class RobotActionTypeBaseService {

  createActionType(_props: ActionTypeCreateRo, _user: IUserBaseInfo): Promise<AutomationActionTypeEntity | null> {
    return Promise.resolve(null);
  }

  getActionType(_lang = 'zh'): Promise<ActionTypeDetailVo[]> {
    return Promise.resolve([]);
  }

  updateActionType(_actionTypeId: string, _data: ActionTypeUpdateRo, _user: IUserBaseInfo): Promise<number> {
    return Promise.resolve(0);
  }
}

@Injectable()
export class RobotActionTypeService extends RobotActionTypeBaseService {

  constructor(
    private automationActionTypeRepository: AutomationActionTypeRepository,
    private automationServiceRepository: AutomationServiceRepository) {
    super();
  }

  override async getActionType(lang = 'zh'): Promise<ActionTypeDetailVo[]> {
    const result = [];
    const webhookActionType: AutomationActionTypeEntity = await this.automationActionTypeRepository.findOneOrFail({
      where: { actionTypeId: 'aatSSHdFkR7B7197Is', isDeleted: 0 }
    });
    if (webhookActionType) {
      const webhookService: AutomationServiceEntity = await this.automationServiceRepository.findOneOrFail({
        where: { serviceId: webhookActionType.serviceId }
      });
      const webhookActionTypeVo = getTypeByItem({
        actionTypeId: webhookActionType.actionTypeId,
        name: webhookActionType.name,
        description: webhookActionType.description,
        endpoint: webhookActionType.endpoint,
        i18n: webhookActionType.i18n,
        inputJsonSchema: webhookActionType.inputJSONSchema,
        outputJsonSchema: webhookActionType.outputJSONSchema,
        serviceId: webhookService.serviceId,
        serviceName: webhookService.name,
        serviceLogo: webhookService.logo,
        serviceSlug: webhookService.slug,
        serviceI18n: webhookService.i18n,
      }, lang) as ActionTypeDetailVo;
      result.push(webhookActionTypeVo);
    }
    result.push(...customActionTypeMetas.values());
    return result;
  }
}