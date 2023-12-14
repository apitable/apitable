import React, { FC } from 'react';
import { Input, InputNumber } from 'antd';
import { DropdownSelect } from '../select';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';
dayjs.extend(advancedFormat);

interface Props {
    interval: 'day'|'month'|'week' | 'hour';
    readonly : boolean;
    value: {
        // interval
        hour?: number;
        minute?: number;
    }
    onUpdate: (value: Props['value']) => void;
}

const weekOptions = Array.from({ length: 7 }, (_, i) => (i))
  .map(item => dayjs().day(item))
  .map(num => ({
    label: num.format('dddd'),
    value: num.day().toString()
  }));

const hourOptions = Array.from({ length: 24 }, (_, i) => (i + 1)).map(num => ({
  label: String(num),
  value: num.toString()
}));

const minuteOptions = Array.from({ length: 59 }, (_, i) => (i + 1)).map(num => ({
  label: num < 10 ? `0${num}` : String(num),
  value: num.toString()
}));

const dayOptions = Array.from({ length: 31 }, (_, i) => {
  return dayjs().set('date', i + 1);
}).map(num => ({
  label: num.format('Do'),
  value: num.date().toString()
}));

export const Timing: FC<Props> = ({
  interval,
  value,
  onUpdate,

}) => {

  console.log('Timing Timing value', value);

  // day of month
  // week days
  // input hour

  switch (interval) {
    case 'hour': {
      return (
        <>
            Every <DropdownSelect
            value={value.hour?.toString()}
            options={hourOptions}
            onSelected={(node) => {
              onUpdate({ ...value,
                hour: Number(node.value)
              });
            }}

          />
            Hours  in

          {/*TODO update postfix*/}
          <DropdownSelect
            value={value.minute?.toString()}
            options={minuteOptions}
            triggerLabel={<>Miniutes</>}
            onSelected={(node) => {
              onUpdate({ ...value,
                minute: Number(node.value)
              });
            }}

          />

          <DropdownSelect
            value={value.minute?.toString()}
            options={dayOptions}
            onSelected={(node) => {
              onUpdate({ ...value,
                minute: Number(node.value)
              });
            }}
          />

          <DropdownSelect
            value={value.minute?.toString()}
            options={weekOptions}
            onSelected={(node) => {
              onUpdate({ ...value,
                minute: Number(node.value)
              });
            }}
          />
        </>
      );
    }

    case 'day': {
      return (
        <>
            Every <Input /> Hours  in <InputNumber />
        </>
      );
    }

    default : {
      return (<></>);
    }
  }

};
