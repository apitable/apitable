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

import { AutomationRobotRunner, ConfigConstant, IActionOutput, IActionType, validateMagicForm } from '@apitable/core';
import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { NodeService } from 'node/services/node.service';
import { InjectLogger } from 'shared/common';
import { RunHistoryStatusEnum } from 'shared/enums/automation.enum';
import { UnreachableCaseError } from 'shared/errors';
import { CommonException, PermissionException, ServerException } from 'shared/exception';
import { IdWorker } from 'shared/helpers/snowflake';
import { IUserBaseInfo } from 'shared/interfaces';
import * as services from '../actions';
import { customActionMap } from '../actions/decorators/automation.action.decorator';
import { IActionResponse } from '../actions/interface/action.response';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from '../repositories/automation.run.history.repository';
import { RobotRobotService } from './robot.robot.service';

/**
 * handle robot execution scheduling
 * TODO:
 * for now robot is a beta feature, we need refactor it to support more features.
 * permission check is important and need to be done first.
 */
@Injectable()
export class AutomationService {
  robotRunner: AutomationRobotRunner;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly automationRobotRepository: AutomationRobotRepository,
    private readonly automationRunHistoryRepository: AutomationRunHistoryRepository,
    private readonly robotService: RobotRobotService,
    private readonly nodeService: NodeService,
  ) {
    this.robotRunner = new AutomationRobotRunner({
      requestActionOutput: this.getActionOutput.bind(this),
      getRobotById: this.getRobotById.bind(this),
      reportResult: this.updateTaskRunHistory.bind(this),
    });
  }

  async checkCreateRobotPermission(resourceId: string) {
    // TODO: permission check
    const robotCount = await this.automationRobotRepository.getRobotCountByResourceId(resourceId);
    if (robotCount > ConfigConstant.MAX_ROBOT_COUNT_PER_DST) {
      throw new ServerException(CommonException.ROBOT_CREATE_OVER_MAX_COUNT_LIMIT);
    }
  }

  async getRobotById(robotId: string) {
    return await this.robotService.getRobotById(robotId);
  }

  /**
   * create an execution record before the task is about to run
   * @param robotId
   * @param taskId
   * @param spaceId
   */
  private async createRunHistory(robotId: string, taskId: string, spaceId: string) {
    const newRunHistory = this.automationRunHistoryRepository.create({
      taskId,
      robotId,
      spaceId,
      status: RunHistoryStatusEnum.RUNNING,
    });
    await this.automationRunHistoryRepository.save(newRunHistory);
  }

  /**
   * update the execution record after the task is completed
   * @param taskId
   * @param success
   * @param data
   */
  async updateTaskRunHistory(taskId: string, success: boolean, data?: any) {
    const runHistory = await this.automationRunHistoryRepository.getRunHistoryByTaskId(taskId);
    runHistory.status = success ? RunHistoryStatusEnum.SUCCESS : RunHistoryStatusEnum.FAILED;
    runHistory.data = data;
    await this.automationRunHistoryRepository.save(runHistory);
  }

  async getActionOutput(actionRuntimeInput: any, actionType: IActionType): Promise<IActionOutput> {
    const url = new URL(actionType.baseUrl);
    switch (url.protocol) {
      // SaaS/third-party service
      // https://<serviceBaseURL>/<endpoint>
      case 'http:': // some self-hosted service may use http
      case 'https:': {
        url.pathname = actionType.endpoint;
        const resp = await fetch(
          url.toString(),
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(actionRuntimeInput)
          }
        );
        return {
          success: resp.status === 200,
          data: await resp.json()
        };
      }
      case 'automation:': {
        // local/official service
        // automation://<serviceSlug>/<endpoint>
        const serviceSlug = url.hostname;
        const endpoint = actionType.endpoint;
        const actionFunc: (input: any) => Promise<IActionResponse<any>> = services[serviceSlug][endpoint];
        const resp = await actionFunc(actionRuntimeInput);
        return {
          success: resp.success,
          data: resp.data as any,
        };
      }
      case 'action:': {
        const connectorKey = url.hostname;
        const connector = customActionMap.get(connectorKey)!;
        const resp = await connector.endpoint(actionRuntimeInput);
        return {
          success: resp.success,
          data: resp.data as any,
        };
      }
      default:
        throw new UnreachableCaseError(actionType.baseUrl as never);
    }
  }

  private async getSpaceIdByRobotId(robotId: string) {
    const resourceId = await this.automationRobotRepository.getResourceIdByRobotId(robotId);
    const rawResult = await this.nodeService.selectSpaceIdByNodeId(resourceId!);
    if (!rawResult?.spaceId) {
      throw new ServerException(PermissionException.NODE_NOT_EXIST);
    }
    return rawResult.spaceId;
  }

  async handleTask(robotId: string, trigger: { input: any; output: any }) {
    const spaceId = await this.getSpaceIdByRobotId(robotId);
    // there is no billing plan yet, so there is no limit. self-hosted should not limit the call.
    // there limit by billing plan
    // const spaceRobotRunTimes = await this.getRobotRunTimesBySpaceId(spaceId);
    // if (spaceRobotRunTimes >= 100000) {
    //   return;
    // }
    const taskId = IdWorker.nextId().toString();// TODO: use uuid
    // 1. create run history
    await this.createRunHistory(robotId, taskId, spaceId);
    try {
      // 2. execute the robot
      await this.robotRunner.run({
        robotId,
        triggerInput: trigger.input,
        triggerOutput: trigger.output,
        taskId
      });
    } catch (error) {
      // 3. update run history when failed
      // runtime error should not be saved to database, it should be logged. then we can find the error by taskId.
      await this.updateTaskRunHistory(taskId, false, null);
      this.logger.error(`RobotRuntimeError[${taskId}]`, (error as Error).message);
    }
  }

  async activeRobot(robotId: string, user: IUserBaseInfo) {
    const errorsByNodeId: any = {};
    try {
      const robot = await this.robotService.getRobotDetailById(robotId);
      const actions = Object.values(robot.actionsById);
      const { trigger, triggerType } = robot as any;
      let isTriggerValid = true;
      if (trigger && triggerType) {
        const triggerInputSchema = triggerType.inputJsonSchema;
        const triggerInput = trigger.input;
        const { hasError, errors, validationError } = validateMagicForm((triggerInputSchema as any).schema, triggerInput);
        if (hasError) {
          isTriggerValid = false;
          this.logger.debug(`trigger is valid: ${isTriggerValid}`);
          errorsByNodeId[trigger.triggerId] = validationError ? [...errors, ...validationError] : errors;
          return {
            ok: false,
            errorsByNodeId
          };
        }
      }
      this.logger.debug(`trigger is valid: ${isTriggerValid}`);
      const noErrors = actions.length > 0 && actions.every(node => {
        const actionType = robot.actionTypesById[node.typeId]!;
        // FIXME: type
        const { hasError, errors, validationError } = validateMagicForm((actionType.inputJSONSchema as any).schema, node.input);
        if (hasError) {
          errorsByNodeId[node.id] = validationError ? [...errors, ...validationError] : errors;
        }
        return !hasError;
      });
      this.logger.debug(`no errors: ${noErrors},${actions}`);
      if (isTriggerValid && noErrors) {
        await this.automationRobotRepository.activeRobot(robotId, user.userId);
        return {
          ok: true,
        };
      }
    } catch (error) {
      this.logger.error('active robot error', error);
      throw new ServerException(CommonException.ROBOT_FORM_CHECK_ERROR);
    }
    return {
      ok: false,
      errorsByNodeId
    };
  }

  async isResourcesHasRobots(resourceIds: string[]) {
    return await this.automationRobotRepository.isResourcesHasRobots(resourceIds);
  }
}