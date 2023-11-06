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

import {
  IActionOutput,
  IActionType,
  IAutomationRobotRunner,
  IReqMethod,
  IRobot,
  IRobotTask,
  IRobotTaskRuntimeContext,
} from 'automation_manager/interface';
import { omit } from 'lodash';
import { InputParser } from './input_parser';
import { MagicVariableParser } from './magic_variable/magic_variable_parser';
import {
  concatParagraph,
  concatString,
  flatten,
  getNodeOutput,
  getObjectProperty,
  JSONStringify,
  length,
  newArray,
  newObject,
} from './magic_variable/sys_functions';

/**
 * handle workflow execution
 */
export class AutomationRobotRunner extends IAutomationRobotRunner {
  constructor(reqMethods: IReqMethod) {
    super();
    // the reqMethods is used to call api of other service, implement by the host of runner(room-server)
    this.reqMethods = reqMethods;
    this.inputParser = this.initInputParser();
  }
  private initInputParser() {
    // functions below are used to parse input of action, you can add any function you want at `./magic_variable/sys_functions`
    // then add it into sysFunctions array. just like standard lib for programming language
    const sysFunctions = [length, flatten, getNodeOutput, getObjectProperty, concatString, concatParagraph, newArray, newObject, JSONStringify];
    const parser = new MagicVariableParser(sysFunctions);
    return new InputParser(parser);
  }
  async run(robotTask: IRobotTask): Promise<void> {
    const robot = await this.reqMethods.getRobotByRobotIdAndTriggerId(robotTask.robotId, robotTask.triggerId);
    const globalContext: IRobotTaskRuntimeContext = this.initRuntimeContext(robotTask, robot);
    const entryActionId = globalContext.robot.entryActionId;
    await this.executeAction(entryActionId, globalContext);
  }
  validateActionInput(_actionType: IActionType, _input: any): boolean {
    // TODO: implement json schema validation
    return true;
  }
  validateActionOutput(_actionType: IActionType, _output: any): boolean {
    // TODO: implement json schema validation
    return true;
  }
  initRuntimeContext(robotTask: IRobotTask, robot: IRobot): IRobotTaskRuntimeContext {
    const context = {
      [robot.triggerId]: {
        typeId: robot.triggerTypeId,
        input: robotTask.triggerInput,
        output: robotTask.triggerOutput,
      },
    };
    const executedNodeIds = [robot.triggerId];
    if (robotTask.extraTrigger) {
      for (const trigger of robotTask.extraTrigger) {
        context[trigger.triggerId] = {
          typeId: trigger.triggerTypeId,
          input: trigger.triggerInput,
          output: trigger.triggerOutput,
        };
        executedNodeIds.push(trigger.triggerId);
      }
    }
    return {
      robot: robot,
      taskId: robotTask.taskId,
      executedNodeIds: executedNodeIds,
      currentNodeId: robot.triggerId,
      context: context,
      isDone: false,
      success: true,
    };
  }
  async executeAction(actionId: string, globalContext: IRobotTaskRuntimeContext) {
    // console.log('globalContext', globalContext, JSON.stringify(globalContext.context));
    globalContext.currentNodeId = actionId;
    const start = new Date().getTime();
    // get instance of the action by id
    const actionInstance = globalContext.robot.actionsById[actionId]!;
    // get type of the action
    const actionType = globalContext.robot.actionTypesById[actionInstance.typeId]!;
    // TODO: validate input
    // if (this.validateActionInput(actionType, actionRuntimeInput)) {}
    let output: IActionOutput | undefined;
    const errorStacks: any[] = [];
    let nextActionId: string | undefined;
    // the input of action may have dynamic value, so we need to parse it
    let actionRuntimeInput;
    try {
      try {
        actionRuntimeInput = this.getRuntimeActionInput(actionId, globalContext);
      } catch (error: any) {
        console.log(
          `actionId:${actionId} actionType:${JSON.stringify(
            omit(actionType, 'inputJSONSchema', 'outputJSONSchema'),
          )} AutomationRobotRunner:executeAction:getRuntimeActionInput error`,
          error,
        );
        throw new Error('action input is invalid');
      }
      if (!this.validateActionInput(actionType, actionRuntimeInput)) {
        console.log(
          `actionId:${actionId} actionType:${JSON.stringify(
            omit(actionType, 'inputJSONSchema', 'outputJSONSchema'),
          )} AutomationRobotRunner:executeAction:validateActionInput failed`,
        );
        throw new Error('action input is invalid');
      }
      // TODO: push task to queue, to ensure the order of execution
      try {
        output = await this.reqMethods.requestActionOutput(actionRuntimeInput, actionType);
      } catch (error: any) {
        // execute action failed, most likely because of network error
        console.log(
          `actionId:${actionId} actionType:${JSON.stringify(
            omit(actionType, 'inputJSONSchema', 'outputJSONSchema'),
          )} AutomationRobotRunner:executeAction:requestActionOutput error`,
          error,
        );
        throw new Error(error.message);
      }
      nextActionId = actionInstance.nextActionId;
      if (output && !output.success) {
        errorStacks.push(...output.data.errors);
        // when some output of action is failed, we should stop the execution, done but failed
        globalContext.isDone = true;
        globalContext.success = false;
      }
    } catch (error) {
      errorStacks.push({
        message: (error as any).message,
      });
      // unexpected error, we should stop the execution, done but failed
      globalContext.isDone = true;
      globalContext.success = false;
    } finally {
      const end = new Date().getTime();
      globalContext.executedNodeIds.push(globalContext.currentNodeId);
      globalContext.context[actionId] = {
        typeId: actionType.id,
        input: actionRuntimeInput,
        output: output?.data,
        startAt: start,
        endAt: end,
        errorStacks,
      };
    }
    if (globalContext.isDone) {
      await this.reportResult(globalContext.taskId, globalContext);
    } else if (nextActionId) {
      await this.executeAction(nextActionId, globalContext);
    } else {
      await this.reportResult(globalContext.taskId, globalContext);
    }
    // }
  }
  getRuntimeActionInput(actionId: string, globalContext: IRobotTaskRuntimeContext): any {
    return this.inputParser.render(globalContext.robot.actionsById[actionId]!.input, globalContext);
  }
  async reportResult(taskId: string, globalContext: IRobotTaskRuntimeContext) {
    await this.reqMethods.reportResult(taskId, globalContext.success, {
      executedNodeIds: globalContext.executedNodeIds,
      nodeByIds: globalContext.context,
    });
  }
}
