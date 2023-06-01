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

import { Test, TestingModule } from '@nestjs/testing';
import { RobotTriggerTypeService } from './robot.trigger.type.service';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationTriggerTypeRepository } from '../repositories/automation.trigger.type.repository';

describe('RobotTriggerTypeServiceTest', () => {
  let module: TestingModule;
  let service: RobotTriggerTypeService;
  let automationTriggerTypeRepository: AutomationTriggerTypeRepository;
  let automationServiceRepository: AutomationServiceRepository;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      providers: [AutomationTriggerTypeRepository, AutomationServiceRepository, RobotTriggerTypeService],
    }).compile();
    automationTriggerTypeRepository = module.get<AutomationTriggerTypeRepository>(AutomationTriggerTypeRepository);
    automationServiceRepository = module.get<AutomationServiceRepository>(AutomationServiceRepository);
    service = module.get<RobotTriggerTypeService>(RobotTriggerTypeService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('given one trigger type when get trigger type then should be get the i18n render trigger type', async() => {
    jest.spyOn(automationTriggerTypeRepository, 'selectAllTriggerType').mockResolvedValue([
      {
        triggerTypeId: 'triggerTypeId',
        name: '$robot_trigger_form_submitted_title',
        description: '$robot_trigger_form_submitted_desc',
        endpoint: 'form_submitted',
        i18n: {
          en: {
            $robot_trigger_form_submitted_desc: 'When a form receives a new response, the robot will start working',
            $robot_trigger_form_submitted_title: 'Form is submitted',
          },
        },
        inputJSONSchema: {},
        outputJSONSchema: {},
        serviceId: 'serviceId',
      },
    ]);
    jest.spyOn(automationServiceRepository, 'selectServiceByServiceIds').mockResolvedValue([
      {
        serviceId: 'serviceId',
        name: 'serviceName',
        logo: 'url',
        slug: 'serviceSlug',
        i18n: {
          en: {
            $serviceName: 'serviceName',
          },
        }
      }
    ]);
    const triggerTypes = await service.getTriggerType('en');
    expect(triggerTypes).toBeDefined();
    expect(triggerTypes.length).toEqual(1);
  });
});
