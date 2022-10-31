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

// the host of robot runner will implement this interface
export type IReqMethod = {
  // get result of action
  requestActionOutput: (actionRuntimeInput: any, actionType: IActionType) => Promise<IActionOutput>;
  // fetch robot by robotId
  getRobotById: (robotId: string) => Promise<IRobot>;
  reportResult(taskId: string, success: boolean, data: any): Promise<void>;
};

export abstract class IAutomationRobotRunner {
  reqMethods: IReqMethod;
  inputParser: InputParser<IRobotTaskRuntimeContext>;
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