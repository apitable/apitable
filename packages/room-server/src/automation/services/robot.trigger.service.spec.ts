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
import { RobotTriggerService } from './robot.trigger.service';
import { AutomationTriggerTypeRepository } from '../repositories/automation.trigger.type.repository';
import { AutomationTriggerRepository } from '../repositories/automation.trigger.repository';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { AutomationTriggerEntity } from '../entities/automation.trigger.entity';
import { EventTypeEnums } from '../events/domains/event.type.enums';
import { ResourceRobotTriggerDto } from '../dtos/resource.robot.trigger.dto';

describe('RobotTriggerServiceTest', () => {
  let module: TestingModule;
  let service: RobotTriggerService;
  let automationTriggerTypeRepository: AutomationTriggerTypeRepository;
  let automationTriggerRepository: AutomationTriggerRepository;
  let automationServiceRepository: AutomationServiceRepository;
  let automationRobotRepository: AutomationRobotRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        AutomationTriggerTypeRepository,
        AutomationTriggerRepository,
        AutomationServiceRepository,
        AutomationRobotRepository,
        RobotTriggerService,
      ],
    }).compile();
    automationTriggerTypeRepository = module.get<AutomationTriggerTypeRepository>(AutomationTriggerTypeRepository);
    automationTriggerRepository = module.get<AutomationTriggerRepository>(AutomationTriggerRepository);
    automationServiceRepository = module.get<AutomationServiceRepository>(AutomationServiceRepository);
    automationRobotRepository = module.get<AutomationRobotRepository>(AutomationRobotRepository);
    service = module.get<RobotTriggerService>(RobotTriggerService);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(automationTriggerTypeRepository).toBeDefined();
    expect(automationTriggerRepository).toBeDefined();
    expect(automationServiceRepository).toBeDefined();
    expect(automationRobotRepository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('given a trigger when get the map about triggers grouped by resource id', async () => {
    jest.spyOn(automationRobotRepository, 'getActiveRobotsByResourceIds').mockResolvedValue([{ resourceId: 'datasheetId', robotId: 'robotId' }]);
    jest
      .spyOn(automationTriggerRepository, 'getAllTriggersByRobotIds')
      .mockResolvedValue([{ triggerId: 'triggerId', robotId: 'robotId', triggerTypeId: 'triggerTypeId' }] as AutomationTriggerEntity[]);
    const triggersGroupByResourceId = await service.getTriggersGroupByResourceId(['datasheetId']);
    expect(triggersGroupByResourceId).toBeDefined();
    expect(Object.keys(triggersGroupByResourceId)).toEqual(['datasheetId']);
  });

  it('given none trigger when get the map about triggers grouped by resource id then should be return empty object', async () => {
    jest.spyOn(automationRobotRepository, 'getActiveRobotsByResourceIds').mockResolvedValue([]);
    jest.spyOn(automationTriggerRepository, 'getAllTriggersByRobotIds').mockResolvedValue([]);
    const triggersGroupByResourceId = await service.getTriggersGroupByResourceId(['datasheetId']);
    expect(triggersGroupByResourceId).toBeDefined();
    expect(Object.keys(triggersGroupByResourceId).length).toEqual(0);
  });

  it("given repositories mock when get resource's robot triggers then should be got the special one", async () => {
    jest
      .spyOn(automationTriggerTypeRepository, 'getTriggerTypeServiceRelByEndPoint')
      .mockResolvedValue([{ serviceId: 'serviceId', triggerTypeId: 'triggerTypeId' }]);
    jest.spyOn(automationServiceRepository, 'countOfficialServiceByServiceId').mockResolvedValue(1);
    jest.spyOn(automationRobotRepository, 'getRobotIdByResourceId').mockResolvedValue([{ robotId: 'robotId' }]);
    jest
      .spyOn(automationTriggerRepository, 'getTriggerByRobotIdAndTriggerTypeId')
      .mockResolvedValue([{ triggerId: 'triggerId', triggerTypeId: 'triggerTypeId', input: {}, robotId: 'robotId' }] as ResourceRobotTriggerDto[]);
    const resourceRobotTriggerDtos = await service.getTriggersByResourceAndEventType('datasheetId', EventTypeEnums.FormSubmitted);
    expect(resourceRobotTriggerDtos).toBeDefined();
    expect(resourceRobotTriggerDtos.length).toEqual(1);
  });

  it("given empty triggers list when get resource's robot triggers then should be got empty list", async () => {
    jest.spyOn(automationTriggerTypeRepository, 'getTriggerTypeServiceRelByEndPoint').mockResolvedValue([]);
    const resourceRobotTriggerDtos = await service.getTriggersByResourceAndEventType('datasheetId', EventTypeEnums.FormSubmitted);
    expect(resourceRobotTriggerDtos).toBeDefined();
    expect(resourceRobotTriggerDtos.length).toEqual(0);
  });

  it("given not official trigger when get resource's robot triggers then should be got empty list", async () => {
    jest
      .spyOn(automationTriggerTypeRepository, 'getTriggerTypeServiceRelByEndPoint')
      .mockResolvedValue([{ serviceId: 'serviceId', triggerTypeId: 'triggerTypeId' }]);
    jest.spyOn(automationServiceRepository, 'countOfficialServiceByServiceId').mockResolvedValue(0);
    const resourceRobotTriggerDtos = await service.getTriggersByResourceAndEventType('datasheetId', EventTypeEnums.FormSubmitted);
    expect(resourceRobotTriggerDtos).toBeDefined();
    expect(resourceRobotTriggerDtos.length).toEqual(0);
  });
});
