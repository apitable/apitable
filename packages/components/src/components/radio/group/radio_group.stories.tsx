import React from 'react';
import { Radio, RadioGroup } from '../index';
import { IRadioGroup } from './interface';
import { StoryType } from '../../../stories/constants';
import { Story } from '@storybook/react';

const TITLE = `${StoryType.Form}/RadioGroup 单选组`;

export default {
  component: RadioGroup,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
  args: {
    children: (
      <>
        <Radio value="1">单选 1</Radio>
        <Radio value="2">单选 2</Radio>
        <Radio value="3">单选 3</Radio>
      </>
    )
  }
};

const Template: Story<IRadioGroup> = (args) => <RadioGroup {...args} />;

export const Column = Template.bind({});
Column.args = {
  name: 'column',
};

export const Inline = Template.bind({});
Inline.args = {
  row: true,
  name: 'inline',
};

export const InlineBlock = Template.bind({});
InlineBlock.args = {
  row: true,
  block: true,
  name: 'inline-block',
};

export const ButtonGroup = Template.bind({});
ButtonGroup.args = {
  isBtn: true,
};

export const SetDefaultValue = Template.bind({});
SetDefaultValue.args = {
  name: 'set-default',
  value: '2'
};

export const ButtonSetDefaultValue = Template.bind({});
ButtonSetDefaultValue.args = {
  name: 'set-btn-default',
  isBtn: true,
  value: '2'
};

export const ButtonSetDefaultValueBlock = Template.bind({});
ButtonSetDefaultValueBlock.args = {
  name: 'set-btn-default-block',
  isBtn: true,
  block: true,
  value: '2'
};

export const WithOptions = Template.bind({});
WithOptions.args = {
  children: undefined,
  name: 'with-option',
  options: [
    { label: '选项 1', value: '1' },
    { label: '选项 2', value: '2' },
    { label: '选项 2', value: '3' }
  ]
};

export const OptionsWithDisabled = Template.bind({});
OptionsWithDisabled.args = {
  children: undefined,
  name: 'with-disable-option',
  row: true,
  options: [
    { label: '选项 1', value: '1' },
    { label: '选项 2', value: '2', disabled: true },
    { label: '选项 2', value: '3' }
  ]
};

export const ButtonOptionsWithDisabled = Template.bind({});
ButtonOptionsWithDisabled.args = {
  children: undefined,
  name: 'with-option',
  row: true,
  isBtn: true,
  options: [
    { label: '选项 1', value: '1' },
    { label: '选项 2', value: '2', disabled: true },
    { label: '选项 2', value: '3' }
  ]
};

export const Disabled = Template.bind({});
Disabled.args = {
  row: true,
  disabled: true,
};