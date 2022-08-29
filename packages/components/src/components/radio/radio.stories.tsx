import React from 'react';
import { Radio } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';

const TITLE = `${StoryType.Form}/Radio 单选`;

export default {
  component: Radio,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
  args: {
    children: '单选',
    value: '1'
  }
};

const Template: Story<any> = (args) => <Radio {...args} />;

export const Default = Template.bind({});

export const DefaultChecked = Template.bind({});
DefaultChecked.args = {
  checked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
  disabled: true,
  checked: true,
};

export const ChangeCallback = Template.bind({});
ChangeCallback.args = {
  onChange: () => {
    alert('选中了😁');
  }
};