export interface IActionType {
  id: string;
  inputJSONSchema: object;
  outputJSONSchema?: object;
  endpoint: string;
  baseUrl: string;
}

export interface IActionInstance<Input> {
  id: string;
  // 动作原型ID
  typeId: string;
  // 动作输入
  input: Input;
  // 
  nextActionId?: string;
}

export interface IRobot {
  // 机器人ID
  id: string;
  triggerId: string;
  triggerTypeId: string;
  // 入口 actionID;
  entryActionId: string;
  // 全部 action map;
  actionsById: Record<string, IActionInstance<any>>;
  // 全部 actionType map;
  actionTypesById: Record<string, IActionType>;
}

export interface IRobotTask {
  // 当前任务 ID
  taskId: string;
  // 要运行的机器人ID
  robotId: string;
  // 触发 trigger 的 input
  triggerInput: any;
  // 触发 trigger 的 output
  triggerOutput: any;
}

/**
 * 用于动态解析任务的全局上下文，一些 action 需要动态获取之前节点的 output，作为 input 传入。
 * 是一个全局上下文，存储了执行过的每一个节点的 output。
 */
export interface IRobotTaskRuntimeContext {
  // uuid
  taskId: string;
  // 机器人完整信息;
  robot: IRobot;
  // 执行过的节点 id。
  executedNodeIds: string[];
  // 当前执行的节点
  currentNodeId: string;
  context: {
    [nodeId: string]: {
      typeId: string; // trigger / action 的 typeId
      input?: any;
      output?: any;
      // 开始时间戳
      startAt?: number;
      // 结束时间戳
      endAt?: number;
      errorStacks?: any[];
    }
  }
  // 任务是否执行完毕，不管是否中途报错。
  isDone: boolean;
  // 执行完毕的 task 是否成功了，存在报错则不成功。
  success: boolean;
}