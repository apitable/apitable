import { IActionOutput, IAutomationRobotRunner, IReqMethod } from './interface/automation_robot_runner.interface';
import { IRobot, IActionType, IRobotTask, IRobotTaskRuntimeContext } from './interface/automation.interface';
import { InputParser } from './input_parser';
import { MagicVariableParser } from './magic_variable/magic_variable_parser';
import {
  getNodeOutput, getObjectProperty, concatString,
  concatParagraph, newArray, newObject, JSONStringify, length, flatten
} from './magic_variable/sys_functions';

/**
 * 消费任务队列中的任务，解析执行·
 */
export class AutomationRobotRunner extends IAutomationRobotRunner {

  constructor(reqMethods: IReqMethod) {
    super();
    this.reqMethods = reqMethods;
    this.inputParser = this.initInputParser();
  }
  private initInputParser() {
    const sysFunctions = [length, flatten, getNodeOutput, getObjectProperty, concatString, concatParagraph, newArray, newObject, JSONStringify];
    const parser = new MagicVariableParser(sysFunctions);
    return new InputParser(parser);
  }
  async run(robotTask: IRobotTask): Promise<void> {
    const robot = await this.reqMethods.getRobotById(robotTask.robotId);
    const globalContext: IRobotTaskRuntimeContext = this.initRuntimeContext(robotTask, robot);
    const entryActionId = globalContext.robot.entryActionId;
    await this.executeAction(entryActionId, globalContext);
  }
  validateActionInput(actionType: IActionType, input: any): boolean {
    // TODO: 实现 json 校验
    return true;
  }
  validateActionOutput(actionType: IActionType, output: any): boolean {
    // TODO: 实现 json 校验
    return true;
  }
  initRuntimeContext(robotTask: IRobotTask, robot: IRobot): IRobotTaskRuntimeContext {
    return {
      robot: robot,
      taskId: robotTask.taskId,
      executedNodeIds: [robot.triggerId],
      currentNodeId: robot.triggerId,
      context: {
        [robot.triggerId]: {
          typeId: robot.triggerTypeId,
          input: robotTask.triggerInput,
          output: robotTask.triggerOutput
        }
      },
      isDone: false,
      success: true, // 没有错误就是成功
    };
  }
  async executeAction(actionId: string, globalContext: IRobotTaskRuntimeContext) {
    // console.log('globalContext', globalContext, JSON.stringify(globalContext.context));
    globalContext.currentNodeId = actionId;
    const start = new Date().getTime();
    // 获取 action 实例
    const actionInstance = globalContext.robot.actionsById[actionId];
    // 获取 action type
    const actionType = globalContext.robot.actionTypesById[actionInstance.typeId];
    // 校验 action 运行时 input
    // if (this.validateActionInput(actionType, actionRuntimeInput)) {
    // 执行 action
    let output: IActionOutput | undefined;
    const errorStacks: any[] = [];
    let nextActionId: string | undefined;
    // 获取 action 运行时 input
    let actionRuntimeInput;
    try {
      try {
        // 目前存在逃过表单校验开启机器人的情况。这里校验输入。
        actionRuntimeInput = this.getRuntimeActionInput(actionId, globalContext);
        if (!this.validateActionInput(actionType, actionRuntimeInput)) {
          throw new Error('action input is invalid');
        }
      } catch (error) {
        throw new Error('action input is invalid');
      }
      // TODO: 推送到队列，保证顺序。
      try {
        output = await this.reqMethods.requestActionOutput(actionRuntimeInput, actionType);
      } catch (error) {
        // 网络原因，action 执行失败了
        throw new Error('action execute failed');
      }
      nextActionId = actionInstance.nextActionId;
      // console.log(output, nextActionId);
      if (output && !output.success) {
        errorStacks.push(...output.data.errors);
        // 报错时候，直接全局执行完成。不再执行
        globalContext.isDone = true;
        // 任何一个报错就是失败了。暂定这样的逻辑。TODO:最后一个校验失败可以认定为可以跳过。算是成功
        globalContext.success = false;
      }
    } catch (error) {
      errorStacks.push({
        message: error.message,
      });
      // 报错时候，直接全局执行完成。不再执行
      globalContext.isDone = true;
      // 任何一个报错就是失败了。暂定这样的逻辑。TODO:最后一个校验失败可以认定为可以跳过。算是成功
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
    return this.inputParser.render(
      globalContext.robot.actionsById[actionId].input,
      globalContext
    );
  }
  async reportResult(taskId: string, globalContext: IRobotTaskRuntimeContext) {
    await this.reqMethods.reportResult(taskId, globalContext.success, {
      executedNodeIds: globalContext.executedNodeIds,
      nodeByIds: globalContext.context,
    });
  }
}