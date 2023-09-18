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

import { RobotTriggerTypeService } from './robot.trigger.type.service';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationTriggerTypeRepository } from '../repositories/automation.trigger.type.repository';
import { EventTypeEnums } from '../events/domains/event.type.enums';
import { OFFICIAL_SERVICE_SLUG } from '../events/helpers/trigger.event.helper';
import { Test, TestingModule } from '@nestjs/testing';

describe('RobotTriggerTypeServiceTest', () => {
  let moduleFixture: TestingModule;
  let service: RobotTriggerTypeService;
  let automationTriggerTypeRepository: AutomationTriggerTypeRepository;
  let automationServiceRepository: AutomationServiceRepository;
  const triggerTypes = [
    {
      serviceId: 'service01',
      triggerTypeId: 'trigger01',
      endpoint: 'record_matches_conditions',
    },
    {
      serviceId: 'service02',
      triggerTypeId: 'trigger02',
      endpoint: 'record_created',
    },
  ];

  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      providers: [AutomationTriggerTypeRepository, AutomationServiceRepository, RobotTriggerTypeService],
    }).compile();
    
    automationTriggerTypeRepository = moduleFixture.get<AutomationTriggerTypeRepository>(AutomationTriggerTypeRepository);
    automationServiceRepository = moduleFixture.get<AutomationServiceRepository>(AutomationServiceRepository);
    service = moduleFixture.get<RobotTriggerTypeService>(RobotTriggerTypeService);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("given two trigger type entity when group trigger's id by the special service slug and endpoints", async() => {
    jest.spyOn(automationTriggerTypeRepository, 'getTriggerTypeServiceRelByEndPoints').mockResolvedValue(triggerTypes);
    jest.spyOn(automationServiceRepository, 'countServiceByServiceIdAndSlug').mockResolvedValue(1);
    const serviceSlugTriggerTypeVo = await service.getServiceSlugToTriggerTypeId(
      [EventTypeEnums.RecordMatchesConditions, EventTypeEnums.RecordCreated],
      OFFICIAL_SERVICE_SLUG,
    );
    expect(serviceSlugTriggerTypeVo).toBeDefined();
    expect(Object.keys(serviceSlugTriggerTypeVo).length).toEqual(2);
  });

  it("given non trigger type entity when group trigger's id by the special service slug and endpoints then should be got empty list", async() => {
    jest.spyOn(automationTriggerTypeRepository, 'getTriggerTypeServiceRelByEndPoints').mockResolvedValue([]);
    const nonServiceSlugTriggerTypeVo = await service.getServiceSlugToTriggerTypeId(
      [EventTypeEnums.RecordMatchesConditions, EventTypeEnums.RecordCreated],
      OFFICIAL_SERVICE_SLUG,
    );
    expect(nonServiceSlugTriggerTypeVo).toBeDefined();
    expect(Object.keys(nonServiceSlugTriggerTypeVo).length).toEqual(0);
  });

  it("given two trigger type entity when group trigger's id by the non-conditional service slug and endpoints then got empty list", async() => {
    jest.spyOn(automationTriggerTypeRepository, 'getTriggerTypeServiceRelByEndPoints').mockResolvedValue(triggerTypes);
    jest.spyOn(automationServiceRepository, 'countServiceByServiceIdAndSlug').mockResolvedValue(0);
    const nonConditionalServiceSlugTriggerTypeVo = await service.getServiceSlugToTriggerTypeId(
      [EventTypeEnums.RecordMatchesConditions, EventTypeEnums.RecordCreated],
      OFFICIAL_SERVICE_SLUG,
    );
    expect(nonConditionalServiceSlugTriggerTypeVo).toBeDefined();
    expect(Object.keys(nonConditionalServiceSlugTriggerTypeVo).length).toEqual(0);
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
            $robot_trigger_form_submitted_desc: 'When a form receives a new response, the automation will start working',
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
