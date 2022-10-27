import { Injectable, Logger } from '@nestjs/common';
import { AutomationRobotRunner, generateRandomString, IActionType, validateMagicForm } from '@apitable/core';
import { InjectLogger } from '../../shared/common';
import { RunHistoryStatusEnum } from 'shared/enums/automation.enum';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from '../repositories/automation.run.history.repository';
import fetch from 'node-fetch';
import { IdWorker } from 'shared/helpers/snowflake';
import { CommonException, PermissionException, ServerException } from '../../shared/exception';
import { NodeRepository } from '../../database/repositories/node.repository';
import { IUserBaseInfo } from '../../shared/interfaces';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationTriggerTypeRepository } from '../repositories/automation.trigger.type.repository';
import { AutomationActionTypeRepository } from '../repositories/automation.action.type.repository';
import { AutomationServiceCreateRo } from '../ros/service.create.ro';
import { TriggerTypeCreateRo } from '../ros/trigger.type.create.ro';
import { ActionTypeCreateRo } from '../ros/action.type.create.ro';
import { ActionTypeUpdateRo } from '../ros/action.type.update.ro';
import { TriggerTypeUpdateRo } from '../ros/trigger.type.update.ro';
import { AutomationServiceUpdateRo } from '../ros/service.update.ro';
import * as services from '../connectors';
import { IActionResponse } from '../connectors/interface';
import { ConfigConstant } from '@apitable/core';

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
    private readonly automationServiceRepository: AutomationServiceRepository,
    private readonly automationTriggerTypeRepository: AutomationTriggerTypeRepository,
    private readonly automationActionTypeRepository: AutomationActionTypeRepository,
    private readonly nodeRepository: NodeRepository,
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
  private replaceSchemaByLanguage(language, source) {
    if (Array.isArray(source)) {
      return source.map((item) => {
        return this.replaceSchemaByLanguage(language, item);
      });
    } else if (typeof source === 'object') {
      const copySource: any = {};
      Object.keys(source).forEach((key) => {
        copySource[key] = this.replaceSchemaByLanguage(language, source[key]);
      });
      return copySource;
    }
    return language[source] || source;
  }

  getTypeByItem(item, lang, type = 'action') {
    const language = item.i18n[lang];
    const inputSchema = item.inputJsonSchema;
    const outputSchema = item.outputJsonSchema;
    const serviceLanguage = item.serviceI18n[lang];
    const idFieldName = type === 'action' ? 'actionTypeId' : 'triggerTypeId';
    return {
      [idFieldName]: item[idFieldName],
      name: language[item.name] || item.name,
      description: language[item.description] || item.description,
      endpoint: item.endpoint,
      inputJsonSchema: this.replaceSchemaByLanguage(language, inputSchema),
      outputJsonSchema: this.replaceSchemaByLanguage(language, outputSchema),
      service: {
        serviceId: item.serviceId,
        name: serviceLanguage[item.serviceName],
        logo: item.serviceLogo,
        slug: item.serviceSlug
      }
    };
  }

  async getActionType(lang = 'zh') {
    const actionTypes = await this.automationRobotRepository.getRobotActionTypes();
    const result = actionTypes.map(actionType => {
      return this.getTypeByItem(actionType, lang);
    });
    return result;
  }

  async getTriggerType(lang = 'zh') {
    const triggerTypes = await this.automationRobotRepository.getRobotTriggerTypes();
    return triggerTypes.map(triggerType => {
      return this.getTypeByItem(triggerType, lang, 'trigger');
    });
  }

  getActiveRobotsByResourceIds(resourceIds: string[]) {
    return this.automationRobotRepository.getActiveRobotsByResourceIds(resourceIds);
  }

  getRobotById(robotId: string) {
    return this.automationRobotRepository.getRobotById(robotId);
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
   * @param status 
   * @param output 
   */
  async updateTaskRunHistory(taskId: string, success: boolean, data?: any) {
    const runHistory = await this.automationRunHistoryRepository.getRunHistoryByTaskId(taskId);
    runHistory.status = success ? RunHistoryStatusEnum.SUCCESS : RunHistoryStatusEnum.FAILED;
    runHistory.data = data;
    await this.automationRunHistoryRepository.save(runHistory);
  }

  async getActionOutput(actionRuntimeInput: any, actionType: IActionType) {
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
          data: resp.data,
        };
      }
    }
  }

  private async getSpaceIdByRobotId(robotId: string) {
    const resourceId = await this.automationRobotRepository.getResourceIdByRobotId(robotId);
    const rawResult = await this.nodeRepository.selectSpaceIdByNodeId(resourceId);
    if (!rawResult?.spaceId) {
      throw new ServerException(PermissionException.NODE_NOT_EXIST);
    }
    return rawResult.spaceId;
  }

  async getRobotRunTimesBySpaceId(spaceId: string) {
    return await this.automationRunHistoryRepository.getRobotRunTimesBySpaceId(spaceId);
  }

  async handleTask(robotId: string, trigger: { input: any; output: any }) {
    const spaceId = await this.getSpaceIdByRobotId(robotId);
    // FIXME: there is no billing plan yet, so there is no limit. self-hosted should not limit the call.
    // const spaceRobotRunTimes = await this.getRobotRunTimesBySpaceId(spaceId);
    // // TODO: limit by billing plan
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
      this.logger.error(`RobotRuntimeError[${taskId}]`, error.message);
    }
  }

  async activeRobot(robotId: string, user: IUserBaseInfo) {
    const errorsByNodeId: any = {};
    try {
      const robot = await this.automationRobotRepository.getRobotDetailById(robotId);
      const actions = Object.values(robot.actionsById);
      const { trigger, triggerType } = robot as any;
      let isTriggerValid = true;
      if (trigger && triggerType) {
        const triggerInputSchema = triggerType.inputJsonSchema;
        const triggerInput = trigger.input;
        const { hasError, errors, validationError } = validateMagicForm((triggerInputSchema as any).schema, triggerInput);
        if (hasError) {
          isTriggerValid = false;
          errorsByNodeId[trigger.triggerId] = validationError ? [...errors, ...validationError] : errors;
          return {
            ok: false,
            errorsByNodeId
          };
        }
      }
      this.logger.debug(`trigger is valid: ${isTriggerValid}`);
      const noErrors = actions.length > 0 && actions.every(node => {
        const actionType = robot.actionTypesById[node.typeId];
        // FIXME: type
        const { hasError, errors, validationError } = validateMagicForm((actionType.inputJSONSchema as any).schema, node.input);
        if (hasError) {
          errorsByNodeId[node.id] = validationError ? [...errors, ...validationError] : errors;
        }
        const noError = !hasError;
        return noError;
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

  async createTriggerType(props: TriggerTypeCreateRo, user: IUserBaseInfo) {
    const { name, description, serviceId, inputJSONSchema, outputJSONSchema, endpoint } = props;
    const triggerType = this.automationTriggerTypeRepository.create({
      triggerTypeId: `att${generateRandomString(15)}`,
      name,
      description,
      serviceId,
      inputJSONSchema,
      outputJSONSchema,
      endpoint,
      createdBy: user.userId,
      updatedBy: user.userId,
    });
    return await this.automationTriggerTypeRepository.save(triggerType);
  }

  async createActionType(props: ActionTypeCreateRo, user: IUserBaseInfo) {
    const { name, description, serviceId, inputJSONSchema, outputJSONSchema, endpoint } = props;
    const actionType = this.automationActionTypeRepository.create({
      actionTypeId: `aat${generateRandomString(15)}`,
      name,
      description,
      serviceId,
      inputJSONSchema,
      outputJSONSchema,
      endpoint,
      createdBy: user.userId,
      updatedBy: user.userId,
    });
    return await this.automationActionTypeRepository.save(actionType);
  }

  async isResourcesHasRobots(resourceIds: string[]) {
    return await this.automationRobotRepository.isResourcesHasRobots(resourceIds);
  }

  async updateActionType(actionTypeId: string, data: ActionTypeUpdateRo, user: IUserBaseInfo) {
    return await this.automationActionTypeRepository.update({ actionTypeId }, {
      ...data,
      updatedBy: user.userId,
    });
  }

  async updateTriggerType(triggerTypeId: string, data: TriggerTypeUpdateRo, user: IUserBaseInfo) {
    return await this.automationTriggerTypeRepository.update({ triggerTypeId }, {
      ...data,
      updatedBy: user.userId,
    });
  }

  async updateService(serviceId: string, data: AutomationServiceUpdateRo, user: IUserBaseInfo) {
    return await this.automationServiceRepository.update({ serviceId }, {
      ...data,
      updatedBy: user.userId,
    });
  }
}