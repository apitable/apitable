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

import { AutomationServiceUpdateRo } from '../ros/service.update.ro';
import { IUserBaseInfo } from '../../shared/interfaces';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { Injectable } from '@nestjs/common';
import { generateRandomString } from '@apitable/core';
import { AutomationServiceCreateRo } from '../ros/service.create.ro';

@Injectable()
export class RobotServiceService {

  constructor(
    private readonly automationServiceRepository: AutomationServiceRepository,
  ) {
  }

  async createService(props: AutomationServiceCreateRo, user: IUserBaseInfo) {
    const { slug, name, logo, baseUrl } = props;
    const service = this.automationServiceRepository.create({
      serviceId: `asv${generateRandomString(15)}`,
      slug: slug,
      name,
      logo,
      baseUrl,
      createdBy: user.userId,
      updatedBy: user.userId,
    });
    return await this.automationServiceRepository.save(service);
  }

  async updateService(serviceId: string, data: AutomationServiceUpdateRo, user: IUserBaseInfo) {
    return await this.automationServiceRepository.update({ serviceId }, {
      ...data,
      updatedBy: user.userId,
    });
  }
}