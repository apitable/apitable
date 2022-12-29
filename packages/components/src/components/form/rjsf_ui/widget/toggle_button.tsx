import { WidgetProps } from '@rjsf/core';
import React from 'react';
import { RadioGroup } from '../../../radio';

export const ToggleButtonWidget = (props: WidgetProps) => {
  return (
    <>
      <RadioGroup
        isBtn
        block
        options={props.options.enumOptions as any}
        onChange={(e, value) => props.onChange(value)}
        value={props.value || props.defaultValue}
      />
    </>
  );
};
