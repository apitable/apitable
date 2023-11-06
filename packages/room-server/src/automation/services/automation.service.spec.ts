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
import { RedisService } from '@apitable/nestjs-redis';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Test, TestingModule } from '@nestjs/testing';
import { TriggerEventHelper } from 'automation/events/helpers/trigger.event.helper';
import { WinstonModule } from 'nest-winston';
import { I18nService } from 'nestjs-i18n';
import { NodeService } from 'node/services/node.service';
import { LoggerConfigService } from 'shared/services/config/logger.config.service';
import { QueueSenderBaseService } from 'shared/services/queue/queue.sender.base.service';
import { RestService } from 'shared/services/rest/rest.service';
import { InternalSpaceAutomationRunsMessageView } from '../../database/interfaces';
import { CommonException } from '../../shared/exception';
import * as services from '../actions';
import { ResponseStatusCodeEnums } from '../actions/enum/response.status.code.enums';
import { AutomationRunHistoryEntity } from '../entities/automation.run.history.entity';
import { AutomationActionRepository } from '../repositories/automation.action.repository';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from '../repositories/automation.run.history.repository';
import { AutomationTriggerRepository } from '../repositories/automation.trigger.repository';
import { AutomationService } from './automation.service';
import { RobotRobotService } from './robot.robot.service';

describe('AutomationServiceTest', () => {
  let moduleFixture: TestingModule;
  let nodeService: NodeService;
  let automationRobotRepository: AutomationRobotRepository;
  let automationRunHistoryRepository: AutomationRunHistoryRepository;
  let automationActionRepository: AutomationActionRepository;
  let automationTriggerRepository: AutomationTriggerRepository;
  let automationService: AutomationService;
  let robotService: RobotRobotService;
  let restService: RestService;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
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
            getRelNodeIdsByMainNodeIds: jest.fn(),
          },
        },
        {
          provide: RobotRobotService,
          useValue: {
            getRobotById: jest.fn(),
          },
        },
        {
          provide: QueueSenderBaseService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
        {
          provide: RestService,
          useValue: {
            getSpaceAutomationRunsMessage: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            translate: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            getClient: () => {
              return {
                exists: jest.fn(),
              };
            },
          },
        },
        AutomationRobotRepository,
        AutomationRunHistoryRepository,
        AutomationActionRepository,
        AutomationTriggerRepository,
        AmqpConnection,
        {
          provide: TriggerEventHelper,
          useValue: {
            getDefaultTriggerOutput: jest.fn(),
          },
        },
      ],
    }).compile();
    nodeService = moduleFixture.get<NodeService>(NodeService);
    automationRobotRepository = moduleFixture.get<AutomationRobotRepository>(AutomationRobotRepository);
    automationRunHistoryRepository = moduleFixture.get<AutomationRunHistoryRepository>(AutomationRunHistoryRepository);
    automationActionRepository = moduleFixture.get<AutomationActionRepository>(AutomationActionRepository);
    automationTriggerRepository = moduleFixture.get<AutomationTriggerRepository>(AutomationTriggerRepository);
    automationService = moduleFixture.get<AutomationService>(AutomationService);
    robotService = moduleFixture.get<RobotRobotService>(RobotRobotService);
    restService = moduleFixture.get<RestService>(RestService);
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  it('should be defined', () => {
    expect(nodeService).toBeDefined();
    expect(automationRobotRepository).toBeDefined();
    expect(automationRunHistoryRepository).toBeDefined();
    expect(automationActionRepository).toBeDefined();
    expect(automationTriggerRepository).toBeDefined();
    expect(automationService).toBeDefined();
    expect(restService).toBeDefined();
  });

  it('should be check create robot permission no exception', async () => {
    jest.spyOn(automationRobotRepository, 'getRobotCountByResourceId').mockResolvedValue(0);
    await automationService.checkCreateRobotPermission('resourceId');
  });

  it('should be check create robot permission throw exception', async () => {
    jest.spyOn(automationRobotRepository, 'getRobotCountByResourceId').mockResolvedValue(ConfigConstant.MAX_ROBOT_COUNT_PER_DST + 1);
    await expect(async () => await automationService.checkCreateRobotPermission('resourceId')).rejects.toThrow(
      CommonException.ROBOT_CREATE_OVER_MAX_COUNT_LIMIT.message,
    );
  });

  it('handleTask should be execute', async () => {
    jest.spyOn(automationRobotRepository, 'getResourceIdByRobotId').mockResolvedValue('datasheetId');
    jest.spyOn(nodeService, 'selectSpaceIdByNodeId').mockResolvedValue({ spaceId: 'spaceId' });
    jest.spyOn(automationRunHistoryRepository, 'create').mockImplementation();
    jest.spyOn(automationRunHistoryRepository, 'insert').mockImplementation();
    jest.spyOn(automationRunHistoryRepository, 'save').mockImplementation();
    jest.spyOn(automationRunHistoryRepository, 'update').mockImplementation();
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
    jest.spyOn(restService, 'getSpaceAutomationRunsMessage').mockResolvedValue({
      maxAutomationRunNums: 100,
      automationRunNums: 50, // The number of automation run in the space
      allowRun: false,
    } as InternalSpaceAutomationRunsMessageView);
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

    await automationService.handleTask('robotId', { triggerId: 'test', input: {}, output: {} });
    delete services['test'];
  });

  it('should return true when resource have linked robot', async () => {
    jest.spyOn(automationRobotRepository, 'count').mockResolvedValue(1);
    const result = await automationService.isResourcesHasRobots(['resourceId']);
    expect(result).toEqual(true);
  });

  it('should return true when trigger have linked robot', async () => {
    jest.spyOn(automationRobotRepository, 'count').mockResolvedValue(0);
    jest.spyOn(automationTriggerRepository, 'selectRobotIdAndResourceIdByResourceIds').mockResolvedValue([
      {
        robotId: 'robotId',
        resourceId: 'resourceId',
      },
    ]);
    jest.spyOn(automationRobotRepository, 'count').mockResolvedValue(1);
    const result = await automationService.isResourcesHasRobots(['resourceId']);
    expect(result).toEqual(true);
  });

  it('should return false when trigger not linked robot -- empty', async () => {
    jest.spyOn(automationRobotRepository, 'count').mockResolvedValue(0);
    jest.spyOn(automationTriggerRepository, 'selectRobotIdAndResourceIdByResourceIds').mockResolvedValue([]);
    jest.spyOn(nodeService, 'getRelNodeIdsByMainNodeIds').mockResolvedValue([]);
    const result = await automationService.isResourcesHasRobots(['resourceId']);
    expect(result).toEqual(false);
  });

  it('should return false when trigger linked robot but robot disable', async () => {
    jest.spyOn(automationRobotRepository, 'count').mockResolvedValue(0);
    jest.spyOn(nodeService, 'getRelNodeIdsByMainNodeIds').mockResolvedValue([]);
    jest.spyOn(automationTriggerRepository, 'selectRobotIdAndResourceIdByResourceIds').mockResolvedValue([
      {
        robotId: 'robotId',
        resourceId: 'resourceId',
      },
    ]);
    jest.spyOn(automationRobotRepository, 'count').mockResolvedValue(0);
    const result = await automationService.isResourcesHasRobots(['resourceId']);
    expect(result).toEqual(false);
  });
});
