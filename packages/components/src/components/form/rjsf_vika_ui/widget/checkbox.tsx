import { WidgetProps } from '@rjsf/core';
import { Switch } from 'components/switch';
import React from 'react';
import styled from 'styled-components';

const CheckboxWrapper = styled.div`
  display: flex;
  cursor: pointer;  
  width: '100%';
  user-select: none;
  padding: 4px;
  border-radius: 4px;
`;

export const CheckboxWidget = (props: WidgetProps) => {
  return (
    <CheckboxWrapper onClick={() => props.onChange(!props.value)}>
      <Switch checked={props.value} /> <span style={{ paddingLeft: 8 }}>{props.schema.description}</span>
    </CheckboxWrapper>
  );
};