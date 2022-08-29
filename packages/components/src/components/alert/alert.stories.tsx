import React from 'react';
import { Alert, showAlert } from './index';
import { Button } from '../button';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { IAlertProps } from './interface';

const COMPONENT_NAME = 'Alert 告警';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: Alert,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
  args: {
    content: '道路千万条，安全第一条，行车不规范，亲人两行泪',
  }
};

const Template: Story<IAlertProps> = (args) => <Alert {...args} />;

export const Default = Template.bind({});

export const SuccessType = Template.bind({});
SuccessType.args = {
  type: 'success'
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  title: '北京第三区交通委，提醒您',
};

export const Closable = Template.bind({});
Closable.args = {
  closable: true
};

export const CloseCallback = Template.bind({});
CloseCallback.args = {
  closable: true,
  onClose: () => alert('我刚才关闭了这条提醒⏰')
};

export const ShowAlertFunction = () => {
  return (
    <Button color="primary" onClick={() => {
      showAlert({
        content: '道路千万条，安全第一条，行车不规范，亲人两行泪',
        type: 'warning',
        closable: true,
        duration: 0,
      });
    }}>
      点击触发告警
    </Button>
  );
  
};