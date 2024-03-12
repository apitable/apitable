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

import { InputParser } from 'automation_manager/input_parser';
import { IActionType, IRobot, IRobotTask, IRobotTaskRuntimeContext } from './automation.interface';

type ISuccessActionOutput = {
  success: true;
  data: {
    data: any;
  };
};

type IFailedActionOutput = {
  success: false;
  data: {
    errors: { message: any }[]
  }
};

export type IActionOutput = ISuccessActionOutput | IFailedActionOutput;

// the host of robot runner will implement this interface
export type IReqMethod = {
  // get result of action
  requestActionOutput: (actionRuntimeInput: any, actionType: IActionType) => Promise<IActionOutput>;
  // fetch robot by robotId
  getRobotById: (robotId: string) => Promise<IRobot>;
  // fetch robot by robotId and triggerId
  getRobotByRobotIdAndTriggerId: (robotId: string, triggerId: string) => Promise<IRobot>;
  reportResult(taskId: string, success: boolean, data: any): Promise<void>;
};

export abstract class IAutomationRobotRunner {
  reqMethods!: IReqMethod;
  inputParser!: InputParser<IRobotTaskRuntimeContext>;
  // run robot task
  abstract run(robotTask: IRobotTask): Promise<void>;
  // validate the input of action, use json schema
  abstract validateActionInput(actionType: IActionType, input: any): boolean;
  // validate the output of action, use json schema
  abstract validateActionOutput(actionType: IActionType, output: any): boolean;
  // the output of trigger need to be initialized in global context, for later actions to use
  abstract initRuntimeContext(robotTask: IRobotTask, robot: IRobot): IRobotTaskRuntimeContext;
  // execute an action node
  abstract executeAction(actionId: string, globalContext: IRobotTaskRuntimeContext): Promise<void>;
  // get action input from global context, transform dynamic params to static
  abstract getRuntimeActionInput(actionId: string, globalContext: IRobotTaskRuntimeContext): any;
  // report result of robot task 
  abstract reportResult(taskId: string, globalContext: IRobotTaskRuntimeContext): void;
}
