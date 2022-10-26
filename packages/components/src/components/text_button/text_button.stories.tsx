import React from 'react';
import { Story } from '@storybook/react';
import { DownloadOutlined } from '@vikadata/icons';
import { iconArg } from '../../stories/args';
import { TextButton } from './index';
import { StoryType } from '../../stories/constants';
import { ITextButtonProps } from './interface';

const COMPONENT_NAME = 'Button';
const BUTTON_TEXT = 'Text Button';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}/TextButton`;

export default {
  component: TextButton,
  title: TITLE,
  argTypes: {
    prefixIcon: iconArg,
    suffixIcon: iconArg,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
  args: {
    children: BUTTON_TEXT
  }
};

const Template: Story<ITextButtonProps> = (args) => <TextButton {...args} />;

export const Default = Template.bind({});

export const PrefixIcon = Template.bind({});
PrefixIcon.args = {
  prefixIcon: <DownloadOutlined />
};

export const SuffixIcon = Template.bind({});
SuffixIcon.args = {
  suffixIcon: <DownloadOutlined />
};

export const DangerColor = Template.bind({});
DangerColor.args = {
  color: 'danger'
};

export const PrimaryColor = Template.bind({});
PrimaryColor.args = {
  color: 'primary'
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  size: 'large'
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true
};

export const Block = Template.bind({});
Block.args = {
  block: true
};