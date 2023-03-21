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
    const actionTypes = await this.automationActionTypeRepository.find({ where: { isDeleted: 0 }});
    for (const actionTypesKey in actionTypes) {
      const actionType = actionTypes[actionTypesKey];
      const service = await this.automationServiceRepository.findOne({
        where: { serviceId: actionType?.serviceId }
      });
      const actionTypeDetailVo = getTypeByItem({
        actionTypeId: actionType?.actionTypeId,
        name: actionType?.name,
        description: actionType?.description,
        endpoint: actionType?.endpoint,
        i18n: actionType?.i18n,
        inputJsonSchema: actionType?.inputJSONSchema,
        outputJsonSchema: actionType?.outputJSONSchema,
        serviceId: service?.serviceId,
        serviceName: service?.name,
        serviceLogo: service?.logo,
        serviceSlug: service?.slug,
        serviceI18n: service?.i18n,
      }, lang) as ActionTypeDetailVo;
      result.push(actionTypeDetailVo);
    }
    result.push(...customActionTypeMetas.values());
    return result;
  }
}