import { InputParser } from 'automation_manager/input_parser';
import { IRobotTask, IRobot, IActionType, IRobotTaskRuntimeContext } from './automation.interface';

type ISuccessActionOutput = {
  success: true;
  data: {
    data: any
  }
};

type IFailedActionOutput = {
  success: false;
  data: {
    errors: { message: any }[]
  }
};

export type IActionOutput = ISuccessActionOutput | IFailedActionOutput;

export type IReqMethod = {
  // 获取 action 的运行结果
  requestActionOutput: (actionRuntimeInput: any, actionType: IActionType) => Promise<IActionOutput>;
  // 通过机器人ID 获取到整个机器人的全部必要信息(运行时分步查询，还是一次性查出来？先一次性查出来)
  getRobotById: (robotId: string) => Promise<IRobot>;
  reportResult(taskId: string, success: boolean, data: any): Promise<void>;
};

export abstract class IAutomationRobotRunner {
  reqMethods: IReqMethod;
  inputParser: InputParser<IRobotTaskRuntimeContext>;
  // 运行一个机器人任务
  abstract run(robotTask: IRobotTask): Promise<void>;
  // 使用 json schema 对 action 的输入输出做校验。
  // 校验 action input 是否合法
  abstract validateActionInput(actionType: IActionType, input: any): boolean;
  // 校验 action output 是否合法
  abstract validateActionOutput(actionType: IActionType, output: any): boolean;
  // trigger 的 output 需要在全局上下文中初始化，供后面的 action 使用
  abstract initRuntimeContext(robotTask: IRobotTask, robot: IRobot): IRobotTaskRuntimeContext;
  // 执行一个 action 节点
  abstract executeAction(actionId: string, globalContext: IRobotTaskRuntimeContext): Promise<void>;
  // 获取运行时的 action input，将动态参数转化为静态
  abstract getRuntimeActionInput(actionId: string, globalContext: IRobotTaskRuntimeContext): any;
  // 上报机器人运行结果
  abstract reportResult(taskId: string, globalContext: IRobotTaskRuntimeContext): void;
}