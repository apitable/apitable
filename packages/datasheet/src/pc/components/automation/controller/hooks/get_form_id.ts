import {IRobotTrigger} from "pc/components/robot/interface";

export const getFormId = (trigger?: Pick<IRobotTrigger, 'input'>) => {

    if (!trigger) {
        return undefined;
    }
    const operands = trigger?.input?.value?.operands ?? [];

    if (operands.length === 0) {
        return undefined;
    }
    // @ts-ignore
    const f = operands.findIndex(item => item === 'formId');
    if (f > -1) {
        return operands[f + 1].value;
    }
    return undefined;
};
