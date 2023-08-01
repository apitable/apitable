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

import { RobotActionTypeService } from './robot.action.type.base.service';
import { AutomationActionTypeRepository } from '../repositories/automation.action.type.repository';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationActionTypeEntity } from '../entities/automation.action.type.entity';
import { AutomationServiceEntity } from '../entities/automation.service.entity';
import { Test, TestingModule } from '@nestjs/testing';

describe('RobotActionTypeServiceTest', () => {
  let moduleFixture: TestingModule;
  let automationActionTypeRepository: AutomationActionTypeRepository;
  let automationServiceRepository: AutomationServiceRepository;
  let service: RobotActionTypeService;

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      providers: [AutomationActionTypeRepository, AutomationServiceRepository, RobotActionTypeService],
    }).compile();
    automationActionTypeRepository = moduleFixture.get<AutomationActionTypeRepository>(AutomationActionTypeRepository);
    automationServiceRepository = moduleFixture.get<AutomationServiceRepository>(AutomationServiceRepository);
    service = moduleFixture.get<RobotActionTypeService>(RobotActionTypeService);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be defined', () => {
    expect(automationActionTypeRepository).toBeDefined();
    expect(automationServiceRepository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('get action type should be return webhook', async() => {
    jest.spyOn(automationActionTypeRepository, 'find').mockResolvedValue([{
      id: 'id',
      serviceId: 'serviceId',
      actionTypeId: 'actionTypeId',
      name: 'name',
      description: 'description',
      endpoint: 'endpoint',
      i18n: { en: {}},
    } as AutomationActionTypeEntity]);
    jest.spyOn(automationServiceRepository, 'findOne').mockResolvedValue({
      id: 'id',
      serviceId: 'serviceId',
      slug: 'slug',
      i18n: { en: {}},
    } as AutomationServiceEntity);
    const detailVos = await service.getActionType('en');
    expect(detailVos).toBeDefined();
    expect(detailVos.length).toBeGreaterThan(0);
  });
});
