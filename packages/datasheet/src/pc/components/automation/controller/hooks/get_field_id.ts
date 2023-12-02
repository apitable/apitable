import { IRobotTrigger } from 'pc/components/robot/interface';

// TODO refactor rename  extract as a parameter
export const getFieldId = (trigger?: Pick<IRobotTrigger, 'input'>) => {
  if (!trigger) {
    return undefined;
  }

  const operands = trigger?.input?.value?.operands ?? [];

  if (operands.length === 0) {
    return undefined;
  }
  // @ts-ignore
  const f = operands.findIndex(item => item === 'fieldId');
  if (f > -1) {
    return operands[f + 1].value;
  }
  return undefined;
};
