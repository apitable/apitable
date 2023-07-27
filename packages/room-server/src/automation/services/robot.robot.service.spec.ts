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
import { AutomationActionTypeRepository } from '../repositories/automation.action.type.repository';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { RobotRobotService } from './robot.robot.service';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { AutomationTriggerRepository } from '../repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from '../repositories/automation.trigger.type.repository';
import { AutomationActionRepository } from '../repositories/automation.action.repository';
import {
  RobotTriggerBaseInfoDto,
  RobotTriggerInfoDto, TriggerTriggerTypeRelDto
} from '../dtos/trigger.dto';
import { RobotActionBaseInfoDto, RobotActionInfoDto } from '../dtos/action.dto';
import { AutomationRobotEntity } from '../entities/automation.robot.entity';
import { ActionTypeBaseInfoDto } from '../dtos/action.type.dto';
import { ServiceBaseUrlDto } from '../dtos/service.dto';
import { CommonException } from '../../shared/exception';
import { TriggerInputJsonSchemaDto } from '../dtos/trigger.type.dto';
import { RobotBaseInfoDto } from '../dtos/robot.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';

describe('RobotRobotServiceTest', () => {
  let moduleFixture: TestingModule;
  let robotRobotService: RobotRobotService;
  let automationRobotRepository: AutomationRobotRepository;
  let automationTriggerRepository: AutomationTriggerRepository;
  let automationTriggerTypeRepository: AutomationTriggerTypeRepository;
  let automationActionRepository: AutomationActionRepository;
  let automationActionTypeRepository: AutomationActionTypeRepository;
  let automationServiceRepository: AutomationServiceRepository;
  
  beforeEach(async() => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        WinstonModule.forRootAsync({
          useClass: LoggerConfigService,
        }),
      ],
      providers: [
        AutomationServiceRepository,
        AutomationRobotRepository,
        AutomationTriggerRepository,
        AutomationTriggerTypeRepository,
        AutomationActionRepository,
        AutomationActionTypeRepository,
        RobotRobotService,
      ],
    }).compile();
    
    automationRobotRepository = moduleFixture.get<AutomationRobotRepository>(AutomationRobotRepository);
    automationTriggerRepository = moduleFixture.get<AutomationTriggerRepository>(AutomationTriggerRepository);
    automationTriggerTypeRepository = moduleFixture.get<AutomationTriggerTypeRepository>(AutomationTriggerTypeRepository);
    automationActionRepository = moduleFixture.get<AutomationActionRepository>(AutomationActionRepository);
    automationActionTypeRepository = moduleFixture.get<AutomationActionTypeRepository>(AutomationActionTypeRepository);
    automationServiceRepository = moduleFixture.get<AutomationServiceRepository>(AutomationServiceRepository);
    robotRobotService = moduleFixture.get<RobotRobotService>(RobotRobotService);
    // The resource(id: resourceId) has three robots(ids: robot-1, robot-2, robot-3).
    // robot-1 and robot-2 all have one trigger(id: trigger-1 and trigger-2), robot-3 not.
    // Only robot-1 has two actions(id: action-1 and action-2).
    const robot1 = {
      resourceId: 'resourceId',
      robotId: 'robot-1',
      isActive: true,
      isDeleted: false,
      createdBy: '1',
    };
    const robot2 = { ...robot1 };
    const robot3 = { ...robot1 };
    robot2.robotId = 'robot-2';
    robot3.robotId = 'robot-3';
    const triggerType = {
      triggerTypeId: 'trigger-type',
      inputJSONSchema: {},
    };
    const trigger1 = {
      triggerId: 'trigger-1',
      triggerTypeId: triggerType.triggerTypeId,
      robotId: robot1.robotId,
      input: {},
    };
    const trigger2 = {
      triggerId: 'trigger-2',
      triggerTypeId: triggerType.triggerTypeId,
      robotId: robot2.robotId,
    };
    const actionType = {
      actionTypeId: 'action-type',
      inputJSONSchema: {},
      outputJSONSchema: {},
      endpoint: 'endpoint',
      serviceId: 'service',
    };
    const action1 = {
      actionId: 'action-1',
      actionTypeId: actionType.actionTypeId,
      prevActionId: null,
      robotId: robot1.robotId,
      input: {}
    };
    const action2 = {
      actionId: 'action-2',
      actionTypeId: actionType.actionTypeId,
      prevActionId: action1.actionId,
      robotId: robot1.robotId,
      input: {}
    };
    const service = {
      serviceId: actionType.serviceId,
      baseUrl: 'baseUrl',
    };
    jest.spyOn(automationRobotRepository, 'selectRobotIdsByResourceId')
      .mockImplementation((resourceId: string): Promise<Pick<AutomationRobotEntity, 'robotId'>[]> => {
        if(resourceId === 'resourceId') {
          return Promise.resolve([{ robotId: robot1.robotId }, { robotId: robot2.robotId }, { robotId: robot3.robotId }]);
        }
        return Promise.resolve([]);
      });
    jest.spyOn(automationRobotRepository, 'selectRobotBaseInfoDtoByRobotIds')
      .mockImplementation((robotIds: string[]): Promise<RobotBaseInfoDto[]> => {
        if (robotIds?.length === 3 && robotIds[0] === robot1.robotId
          && robotIds[1] === robot2.robotId && robotIds[2] === robot3.robotId) {
          return Promise.resolve([robot1, robot2, robot3]);
        }
        return Promise.resolve([]);
      });
    jest.spyOn(automationTriggerRepository, 'selectTriggerInfoByRobotId')
      .mockImplementation((robotId: string): Promise<RobotTriggerInfoDto | undefined> => {
        if(robotId === robot1.robotId) {
          return Promise.resolve(trigger1);
        }
        if(robotId === robot2.robotId) {
          return Promise.resolve(trigger2);
        }
        return Promise.resolve(undefined);
      });
    jest.spyOn(automationTriggerTypeRepository, 'selectInputJsonSchemaById')
      .mockImplementation((triggerTypeId: string): Promise<TriggerInputJsonSchemaDto | undefined> => {
        if(triggerTypeId === triggerType.triggerTypeId) {
          return Promise.resolve(triggerType);
        }
        return Promise.resolve(undefined);
      });
    jest.spyOn(automationTriggerRepository, 'selectTriggerBaseInfosByRobotIds')
      .mockImplementation((robotIds: string[]): Promise<RobotTriggerBaseInfoDto[]> => {
        if (robotIds?.length === 3 && robotIds[0] === robot1.robotId
          && robotIds[1] === robot2.robotId && robotIds[2] === robot3.robotId) {
          return Promise.resolve([trigger1, trigger2]);
        }
        return Promise.resolve([]);
      });
    jest.spyOn(automationActionRepository, 'selectActionInfosByRobotId')
      .mockImplementation((robotId: string): Promise<RobotActionInfoDto[]>=> {
        if (robotId === robot1.robotId) {
          return Promise.resolve([action1 as RobotActionInfoDto, action2 as RobotActionInfoDto]);
        }
        return Promise.resolve([]);
      });
    jest.spyOn(automationActionRepository, 'selectActionBaseInfosByRobotIds')
      .mockImplementation((robotIds: string[]): Promise<RobotActionBaseInfoDto[]> => {
        if (robotIds?.length === 3 && robotIds[0] === robot1.robotId
          && robotIds[1] === robot2.robotId && robotIds[2] === robot3.robotId) {
          return Promise.resolve([action2, action1]);
        }
        return Promise.resolve([]);
      });
    jest.spyOn(automationActionTypeRepository, 'selectByActionTypeIds')
      .mockImplementation((actionTypeIds: string[]): Promise<ActionTypeBaseInfoDto[]> => {
        if (actionTypeIds?.length === 1 && actionTypeIds[0] === action1.actionTypeId) {
          return Promise.resolve([actionType]);
        }
        return Promise.resolve([]);
      });
    jest.spyOn(automationServiceRepository, 'selectBaseUrlsByServiceIds')
      .mockImplementation((serviceIds: string[]): Promise<ServiceBaseUrlDto[]> => {
        if(serviceIds?.length === 1 && serviceIds[0] === service.serviceId) {
          return Promise.resolve([service]);
        }
        return Promise.resolve([]);
      });
  });

  afterEach(async() => {
    await moduleFixture.close();
  });

  it('should get robot base info by robot ids', async() => {
    const robotBaseInfoVos = await robotRobotService.getRobotBaseInfoByIds(['robot-1', 'robot-2', 'robot-3']);
    expect(robotBaseInfoVos.length).toEqual(3);
    expect(robotBaseInfoVos[2]!.nodes.length).toEqual(0);
    expect(robotBaseInfoVos[1]!.nodes.length).toEqual(1);
    expect(robotBaseInfoVos[0]!.nodes.length).toEqual(3);
    expect((robotBaseInfoVos[0]!.nodes[0] as TriggerTriggerTypeRelDto).triggerId).toEqual('trigger-1');
    expect((robotBaseInfoVos[0]!.nodes[1] as RobotActionBaseInfoDto).actionId).toEqual('action-1');
    expect((robotBaseInfoVos[0]!.nodes[2] as RobotActionBaseInfoDto).actionId).toEqual('action-2');
    expect((robotBaseInfoVos[0]!.nodes[1] as RobotActionBaseInfoDto).prevActionId).toEqual(null);
    expect((robotBaseInfoVos[0]!.nodes[1] as RobotActionBaseInfoDto).nextActionId).toEqual('action-2');
    expect((robotBaseInfoVos[0]!.nodes[2] as RobotActionBaseInfoDto).prevActionId).toEqual('action-1');
    expect((robotBaseInfoVos[0]!.nodes[2] as RobotActionBaseInfoDto).nextActionId).toEqual(undefined);
  });

  it('should get robot base info by resource id', async() => {
    const robotBaseInfoVos = await robotRobotService.getRobotListByResourceId('resourceId');
    expect(robotBaseInfoVos.length).toEqual(3);
  });

  it('should get robot details info by robot id', async() => {
    const iRobot = await robotRobotService.getRobotById('robot-1');
    expect(iRobot.id).toEqual('robot-1');
    expect(iRobot.triggerId).toEqual('trigger-1');
    expect(iRobot.triggerTypeId).toEqual('trigger-type');
    expect(iRobot.entryActionId).toEqual('action-1');
    expect(iRobot.actionsById['action-1']?.id).toEqual('action-1');
    expect(iRobot.actionsById['action-1']?.typeId).toEqual('action-type');
    expect(iRobot.actionsById['action-1']?.input).toEqual({});
    expect(iRobot.actionsById['action-1']?.nextActionId).toEqual('action-2');
    expect(iRobot.actionTypesById['action-type']?.id).toEqual('action-type');
    expect(iRobot.actionTypesById['action-type']?.baseUrl).toEqual('baseUrl');
    expect(iRobot.actionTypesById['action-type']?.endpoint).toEqual('endpoint');
    expect(iRobot.actionTypesById['action-type']?.inputJSONSchema).toEqual({});
    expect(iRobot.actionTypesById['action-type']?.outputJSONSchema).toEqual({});
  });

  it('should be throw exception when the action is empty', async()=> {
    await expect(async() => {
      await robotRobotService.getRobotById('robot-2');
    }).rejects.toThrow(CommonException.ROBOT_FORM_CHECK_ERROR.message);
  });

  it('should be throw exception when the trigger is empty', async()=> {
    await expect(async() => {
      await robotRobotService.getRobotById('robot-3');
    }).rejects.toThrow(CommonException.ROBOT_FORM_CHECK_ERROR.message);
  });

  it('should get robot detail info vo by robot id', async() => {
    const robotDetailVo = await robotRobotService.getRobotDetailById('robot-1');
    expect(robotDetailVo.id).toEqual('robot-1');
    expect(robotDetailVo.triggerId).toEqual('trigger-1');
    expect(robotDetailVo.triggerTypeId).toEqual('trigger-type');
    expect(robotDetailVo.entryActionId).toEqual('action-1');
    expect(robotDetailVo.actionsById['action-1']?.id).toEqual('action-1');
    expect(robotDetailVo.actionsById['action-1']?.typeId).toEqual('action-type');
    expect(robotDetailVo.actionsById['action-1']?.input).toEqual({});
    expect(robotDetailVo.actionsById['action-1']?.nextActionId).toEqual('action-2');
    expect(robotDetailVo.actionTypesById['action-type']?.id).toEqual('action-type');
    expect(robotDetailVo.actionTypesById['action-type']?.baseUrl).toEqual('baseUrl');
    expect(robotDetailVo.actionTypesById['action-type']?.endpoint).toEqual('endpoint');
    expect(robotDetailVo.actionTypesById['action-type']?.inputJSONSchema).toEqual({});
    expect(robotDetailVo.actionTypesById['action-type']?.outputJSONSchema).toEqual({});
    expect((robotDetailVo.trigger as RobotTriggerInfoDto).triggerId).toEqual('trigger-1');
    expect((robotDetailVo.trigger as RobotTriggerInfoDto).triggerTypeId).toEqual('trigger-type');
    expect((robotDetailVo.trigger as RobotTriggerInfoDto).input).toEqual({});
    expect(robotDetailVo.triggerType?.triggerTypeId).toEqual('trigger-type');
    expect(robotDetailVo.triggerType?.inputJSONSchema).toEqual({});
  });

});