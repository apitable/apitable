import { Just, Maybe } from 'purify-ts/index';
import { CronConverter, ICronSchema } from '@apitable/components';
import { AutomationInterval } from '@apitable/components/dist/components/time/utils';
import { objectCombOperand } from '@apitable/core';
import { getDataParameter, getDataSlot } from 'pc/components/automation/controller/hooks/get_data_parameter';
import { literal2Operand } from 'pc/components/robot/robot_detail/node_form/ui/utils';

export type NodeFormData = any;
export const TimeScheduleTransformer = {
  modifyNodeValue: (formData: NodeFormData, name: string, value: string | undefined): NodeFormData => {
    const _newFormData = {
      type: 'Expression',
      value: {
        operator: 'newObject',
        operands: objectCombOperand([...formData.value.operands, name, value]),
      },
    };
    return _newFormData;
  },
  modifyNodeForm: <T extends keyof ICronSchema>(formData: NodeFormData, name: T, value: object | undefined): NodeFormData => {
    const _newFormData = {
      type: 'Expression',
      value: {
        operator: 'newObject',
        operands: objectCombOperand([...formData.value.operands, name, value]),
      },
    };
    return _newFormData;
  },
};
export const TimeScheduleManager = {
  getCronWithTimeZone: (formData: NodeFormData): ICronSchema => {
    return {
      dayOfMonth: getDataParameter<string>(formData, 'dayOfMonth'),
      dayOfWeek: getDataParameter<string>(formData, 'dayOfWeek'),
      hour: getDataParameter<string>(formData, 'hour'),
      minute: getDataParameter<string>(formData, 'minute'),
      month: getDataParameter<string>(formData, 'month'),
      second: getDataParameter<string>(formData, 'second'),
    };
  },

  checkScheduleConfig: (previous: NodeFormData, next: NodeFormData): NodeFormData => {
    const scheduleName1 = getDataParameter<string>(previous, 'scheduleType');
    const scheduleName2 = getDataParameter<string>(next, 'scheduleType');

    if (scheduleName1 !== scheduleName2 && scheduleName2 != null) {
      const EmptyObjectOperand = {
        type: 'Expression',
        value: {
          operator: 'newObject',
          operands: [],
        },
      };
      const scheduleRule = getDataSlot<NodeFormData>(next, 'scheduleRule') ?? EmptyObjectOperand;
      const scheduleName = CronConverter.getDefaultValue(scheduleName2 as AutomationInterval);
      const x = CronConverter.extractCron(scheduleName)!;
      const newData: Maybe<NodeFormData> = Just(scheduleRule)
        .chain((item) => Just(TimeScheduleTransformer.modifyNodeForm(item, 'dayOfWeek', literal2Operand(x.dayOfWeek))))
        .chain((item) => Just(TimeScheduleTransformer.modifyNodeForm(item, 'minute', literal2Operand(x.minute))))
        .chain((item) => Just(TimeScheduleTransformer.modifyNodeForm(item, 'month', literal2Operand(x.month))))
        .chain((item) => Just(TimeScheduleTransformer.modifyNodeForm(item, 'hour', literal2Operand(x.hour))))
        .chain((item) => Just(TimeScheduleTransformer.modifyNodeForm(item, 'dayOfMonth', literal2Operand(x.dayOfMonth))));

      return TimeScheduleTransformer.modifyNodeValue(next, 'scheduleRule', newData.extract());
    }
    return next;
  },
};
