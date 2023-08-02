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

import { RobotTriggerService } from './robot.trigger.service';
import { AutomationTriggerTypeRepository } from '../repositories/automation.trigger.type.repository';
import { AutomationTriggerRepository } from '../repositories/automation.trigger.repository';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { AutomationTriggerEntity } from '../entities/automation.trigger.entity';
import { EventTypeEnums } from '../events/domains/event.type.enums';
import { ResourceRobotTriggerDto } from '../dtos/trigger.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';

describe('RobotTriggerServiceTest', () => {
  let moduleFixture: TestingModule;
  let robotTriggerService: RobotTriggerService;
  let automationTriggerTypeRepository: AutomationTriggerTypeRepository;
  let automationTriggerRepository: AutomationTriggerRepository;
  let automationServiceRepository: AutomationServiceRepository;
  let automationRobotRepository: AutomationRobotRepository;
  
  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        WinstonModule.forRootAsync({
          useClass: LoggerConfigService,
        }),
      ],
      providers: [
        AutomationTriggerTypeRepository,
        AutomationTriggerRepository,
        AutomationServiceRepository,
        AutomationRobotRepository,
        RobotTriggerService,
      ],
    }).compile();
    
    automationTriggerTypeRepository = moduleFixture.get<AutomationTriggerTypeRepository>(AutomationTriggerTypeRepository);
    automationTriggerRepository = moduleFixture.get<AutomationTriggerRepository>(AutomationTriggerRepository);
    automationServiceRepository = moduleFixture.get<AutomationServiceRepository>(AutomationServiceRepository);
    automationRobotRepository = moduleFixture.get<AutomationRobotRepository>(AutomationRobotRepository);
    robotTriggerService = moduleFixture.get<RobotTriggerService>(RobotTriggerService);
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should be defined', () => {
    expect(automationTriggerTypeRepository).toBeDefined();
    expect(automationTriggerRepository).toBeDefined();
    expect(automationServiceRepository).toBeDefined();
    expect(automationRobotRepository).toBeDefined();
    expect(robotTriggerService).toBeDefined();
  });

  it('given a trigger when get the map about triggers grouped by resource id', async() => {
    jest.spyOn(automationRobotRepository, 'getActiveRobotsByResourceIds').mockResolvedValue([{ resourceId: 'datasheetId', robotId: 'robotId' }]);
    jest
      .spyOn(automationTriggerRepository, 'getAllTriggersByRobotIds')
      .mockResolvedValue([{ triggerId: 'triggerId', robotId: 'robotId', triggerTypeId: 'triggerTypeId' }] as AutomationTriggerEntity[]);
    const triggersGroupByResourceId = await robotTriggerService.getTriggersGroupByResourceId(['datasheetId']);
    expect(triggersGroupByResourceId).toBeDefined();
    expect(Object.keys(triggersGroupByResourceId)).toEqual(['datasheetId']);
  });

  it('given none trigger when get the map about triggers grouped by resource id then should be return empty object', async() => {
    jest.spyOn(automationRobotRepository, 'getActiveRobotsByResourceIds').mockResolvedValue([]);
    jest.spyOn(automationTriggerRepository, 'getAllTriggersByRobotIds').mockResolvedValue([]);
    const triggersGroupByResourceId = await robotTriggerService.getTriggersGroupByResourceId(['datasheetId']);
    expect(triggersGroupByResourceId).toBeDefined();
    expect(Object.keys(triggersGroupByResourceId).length).toEqual(0);
  });

  it("given repositories mock when get resource's robot triggers then should be got the special one", async() => {
    jest
      .spyOn(automationTriggerTypeRepository, 'getTriggerTypeServiceRelByEndPoint')
      .mockResolvedValue([{ serviceId: 'serviceId', triggerTypeId: 'triggerTypeId' }]);
    jest.spyOn(automationServiceRepository, 'countOfficialServiceByServiceId').mockResolvedValue(1);
    jest.spyOn(automationRobotRepository, 'selectRobotIdByResourceId').mockResolvedValue([{ robotId: 'robotId' }]);
    jest
      .spyOn(automationTriggerRepository, 'getTriggerByRobotIdAndTriggerTypeId')
      .mockResolvedValue([{ triggerId: 'triggerId', triggerTypeId: 'triggerTypeId', input: {}, robotId: 'robotId' }] as ResourceRobotTriggerDto[]);
    const resourceRobotTriggerDtos = await robotTriggerService.getTriggersByResourceAndEventType('datasheetId', EventTypeEnums.FormSubmitted);
    expect(resourceRobotTriggerDtos).toBeDefined();
    expect(resourceRobotTriggerDtos.length).toEqual(1);
  });

  it("given empty triggers list when get resource's robot triggers then should be got empty list", async() => {
    jest.spyOn(automationTriggerTypeRepository, 'getTriggerTypeServiceRelByEndPoint').mockResolvedValue([]);
    const resourceRobotTriggerDtos = await robotTriggerService.getTriggersByResourceAndEventType('datasheetId', EventTypeEnums.FormSubmitted);
    expect(resourceRobotTriggerDtos).toBeDefined();
    expect(resourceRobotTriggerDtos.length).toEqual(0);
  });

  it("given not official trigger when get resource's robot triggers then should be got empty list", async() => {
    jest
      .spyOn(automationTriggerTypeRepository, 'getTriggerTypeServiceRelByEndPoint')
      .mockResolvedValue([{ serviceId: 'serviceId', triggerTypeId: 'triggerTypeId' }]);
    jest.spyOn(automationServiceRepository, 'countOfficialServiceByServiceId').mockResolvedValue(0);
    const resourceRobotTriggerDtos = await robotTriggerService.getTriggersByResourceAndEventType('datasheetId', EventTypeEnums.FormSubmitted);
    expect(resourceRobotTriggerDtos).toBeDefined();
    expect(resourceRobotTriggerDtos.length).toEqual(0);
  });
});
