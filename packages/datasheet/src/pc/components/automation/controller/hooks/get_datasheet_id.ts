import { IRobotTrigger } from 'pc/components/robot/interface';

export const getDatasheetId = (trigger?: Pick<IRobotTrigger, 'input'>) => {
  if (!trigger) {
    return undefined;
  }

  const operands = trigger?.input?.value?.operands ?? [];

  if (operands.length === 0) {
    return undefined;
  }
  // @ts-ignore
  const f = operands.findIndex(item => item === 'datasheetId');
  if (f > -1) {
    return operands[f + 1].value;
  }
  return undefined;
};
