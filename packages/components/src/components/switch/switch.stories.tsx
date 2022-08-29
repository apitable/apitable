import React from 'react';
import { Switch } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { ISwitchProps } from './interface';

const COMPONENT_NAME = 'Switch 开关';

const TITLE = `${StoryType.Form}/${COMPONENT_NAME}`;

export default {
  component: Switch,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
};

const Template: Story<ISwitchProps> = (args) => <Switch {...args} />;

export const Default = Template.bind({});

export const DefaultChecked = Template.bind({});
DefaultChecked.args = {
  defaultChecked: true
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  size: 'small'
};

export const CloseDisabled = Template.bind({});
CloseDisabled.args = {
  disabled: true
};

export const OpenDisabled = Template.bind({});
OpenDisabled.args = {
  disabled: true,
  defaultChecked: true
};

export const CloseLoading = Template.bind({});
CloseLoading.args = {
  loading: true
};

export const OpenLoading = Template.bind({});
OpenLoading.args = {
  loading: true,
  defaultChecked: true
};

export const ChangeStatus = () => {
  const [status, setStatus] = React.useState(false);
  return (
    <Switch
      checked={status}
      onClick={(s) => {
        setStatus(s);
        alert(`状态改为${s ? '开启' : '关闭'}`);
      }}
    />
  );
};