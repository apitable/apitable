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

export interface IActionType {
  id: string;
  inputJSONSchema: object;
  outputJSONSchema?: object;
  endpoint: string;
  baseUrl: string;
}

export interface IActionInstance<Input> {
  id: string;
  // action type id
  typeId: string;
  // action input
  input: Input;
  // 
  nextActionId?: string;
}

export interface IRobot {
  // robot id
  id: string;
  triggerId: string;
  triggerTypeId: string;
  entryActionId: string;
  // action map;
  actionsById: Record<string, IActionInstance<any>>;
  // actionType map;
  actionTypesById: Record<string, IActionType>;
}

export interface IRobotTaskExtraTrigger {
  triggerId: string;
  triggerTypeId: string;
  triggerInput: any;
  triggerOutput: any;
}

export interface IRobotTask {
  taskId: string;
  robotId: string;
  // add on multi-trigger
  triggerId: string;
  triggerInput: any;
  triggerOutput: any;
  status: number;
  // add on multi-trigger
  extraTrigger?: IRobotTaskExtraTrigger[];
}

/**
 * manage runtime context of robot task, we store the output of each node in this context, so we can use it in later nodes.
 */
export interface IRobotTaskRuntimeContext {
  // uuid, every task has a unique id
  taskId: string;
  // detail of robot, include detail of trigger & actions
  robot: IRobot;
  executedNodeIds: string[];
  // execute all nodes in order, currentNodeId is the node to be executed
  currentNodeId: string;
  context: {
    [nodeId: string]: {
      typeId: string; // typeId of trigger or action
      input?: any;
      output?: any;
      // timestamp of node execution start
      startAt?: number;
      // timestamp of node execution end
      endAt?: number;
      errorStacks?: any[];
    }
  }
  // is this task done, no matter if there is an error
  isDone: boolean;
  // is this task success, if there is an error, it is not success
  success: boolean;
}
