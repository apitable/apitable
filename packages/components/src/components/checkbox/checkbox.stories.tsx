import React from 'react';
import { Checkbox } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { ICheckboxProps } from './interface';

const COMPONENT_NAME = 'Checkbox 勾选';

const TITLE = `${StoryType.Form}/${COMPONENT_NAME}`;

export default {
  component: Checkbox,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
};

const Template: Story<ICheckboxProps> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: '默认选项'
};

export const DefaultChecked = Template.bind({});
DefaultChecked.args = {
  checked: true,
  children: '默认勾选项',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  children: '禁用选项',
};

export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
  disabled: true,
  checked: true,
  children: '禁用勾选项',
};

export const CustomSizeTo40 = Template.bind({});
CustomSizeTo40.args = {
  size: 40,
  children: '40px 尺寸选项',
};

export const CustomSizeToRed = Template.bind({});
CustomSizeToRed.args = {
  color: 'red',
  children: '红色勾选项',
};

export const Callback = Template.bind({});
Callback.args = {
  onChange: val => alert(`状态：${val ? '勾选': '取消勾选'}`),
  children: '监听选项',
};