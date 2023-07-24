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

import { ConfigConstant } from '@apitable/core';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { NodeService } from 'node/services/node.service';
import { CommonException } from '../../shared/exception';
import { LoggerConfigService } from '../../shared/services/config/logger.config.service';
import * as services from '../actions';
import { ResponseStatusCodeEnums } from '../actions/enum/response.status.code.enums';
import { AutomationRunHistoryEntity } from '../entities/automation.run.history.entity';
import { AutomationActionRepository } from '../repositories/automation.action.repository';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from '../repositories/automation.run.history.repository';
import { AutomationTriggerRepository } from '../repositories/automation.trigger.repository';
import { AutomationService } from './automation.service';
import { RobotRobotService } from './robot.robot.service';

describe('RobotActionTypeServiceTest', () => {
  let module: TestingModule;
  let nodeService: NodeService;
  let automationRobotRepository: AutomationRobotRepository;
  let automationRunHistoryRepository: AutomationRunHistoryRepository;
  let automationActionRepository: AutomationActionRepository;
  let automationTriggerRepository: AutomationTriggerRepository;
  let service: AutomationService;
  let robotService: RobotRobotService;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [
        WinstonModule.forRootAsync({
          useClass: LoggerConfigService,
        }),
      ],
      providers: [
        AutomationService,
        {
          provide: NodeService,
          useValue: {
            selectSpaceIdByNodeId: jest.fn(),
          },
        },
        {
          provide: RobotRobotService,
          useValue: {
            getRobotById: jest.fn(),
          },
        },
        AutomationRobotRepository,
        AutomationRunHistoryRepository,
        AutomationActionRepository,
        AutomationTriggerRepository,
        AmqpConnection
      ],
    }).compile();
    nodeService = module.get<NodeService>(NodeService);
    automationRobotRepository = module.get<AutomationRobotRepository>(AutomationRobotRepository);
    automationRunHistoryRepository = module.get<AutomationRunHistoryRepository>(AutomationRunHistoryRepository);
    automationActionRepository = module.get<AutomationActionRepository>(AutomationActionRepository);
    automationTriggerRepository = module.get<AutomationTriggerRepository>(AutomationTriggerRepository);
    service = module.get<AutomationService>(AutomationService);
    robotService = module.get<RobotRobotService>(RobotRobotService);
  });

  it('should be defined', () => {
    expect(nodeService).toBeDefined();
    expect(automationRobotRepository).toBeDefined();
    expect(automationRunHistoryRepository).toBeDefined();
    expect(automationActionRepository).toBeDefined();
    expect(automationTriggerRepository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should be check create robot permission no exception', async() => {
    jest.spyOn(automationRobotRepository, 'getRobotCountByResourceId').mockResolvedValue(0);
    await service.checkCreateRobotPermission('resourceId');
  });

  it('should be check create robot permission throw exception', async() => {
    jest.spyOn(automationRobotRepository, 'getRobotCountByResourceId').mockResolvedValue(ConfigConstant.MAX_ROBOT_COUNT_PER_DST + 1);
    await expect(async() => await service.checkCreateRobotPermission('resourceId')).rejects.toThrow(
      CommonException.ROBOT_CREATE_OVER_MAX_COUNT_LIMIT.message,
    );
  });

  it('handleTask should be execute', async() => {
    jest.spyOn(automationRobotRepository, 'getResourceIdByRobotId').mockResolvedValue('datasheetId');
    jest.spyOn(nodeService, 'selectSpaceIdByNodeId').mockResolvedValue({ spaceId: 'spaceId' });
    jest.spyOn(automationRunHistoryRepository, 'create').mockImplementation();
    jest.spyOn(automationRunHistoryRepository, 'insert').mockImplementation();
    jest.spyOn(automationRunHistoryRepository, 'save').mockImplementation();
    jest.spyOn(robotService, 'getRobotById').mockResolvedValue({
      id: 'robotId',
      triggerId: 'triggerId',
      triggerTypeId: 'triggerTypeId',
      entryActionId: 'actionId',
      actionsById: {
        actionId: {
          id: 'actionId',
          typeId: 'actionTypeId',
          input: {
            type: 'Expression',
            value: {
              operands: [
                'property',
                {
                  type: 'Literal',
                  value: 'value',
                },
              ],
              operator: 'newObject',
            },
          },
          nextActionId: null,
          prevActionId: null,
        } as any,
      },
      actionTypesById: {
        actionTypeId: {
          id: 'actionTypeId',
          inputJSONSchema: {},
          outputJSONSchema: {},
          endpoint: 'endpoint',
          baseUrl: 'automation://test',
        },
      },
    });
    jest.spyOn(automationRunHistoryRepository, 'getRunHistoryByTaskId').mockResolvedValue({
      id: 'id',
      taskId: 'taskId',
      robotId: 'robotId',
      spaceId: 'spaceId',
      status: 0,
      createdAt: new Date(),
    } as AutomationRunHistoryEntity);
    jest.spyOn(automationRunHistoryRepository, 'insert').mockImplementation();

    services['test'] = {
      endpoint: (input: any) => {
        expect(input.property).toEqual('value');
        return Promise.resolve({
          success: true,
          code: ResponseStatusCodeEnums.Success,
        });
      },
    };

    await service.handleTask('robotId', { input: {}, output: {}});
    delete services['test'];
  });
});
