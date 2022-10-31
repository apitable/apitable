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

export interface IRobotTask {
  taskId: string;
  robotId: string;
  triggerInput: any;
  triggerOutput: any;
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