import React from 'react';
import { Story } from '@storybook/react';
import { ArrowRightOutlined } from '@apitable/icons';
import { iconPrimaryArg } from '../../stories/args';
import { IconButton } from './index';
import { StoryType } from '../../stories/constants';
import { IIconButtonProps } from './interface';

const COMPONENT_NAME = 'Button';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}/IconButton`;

export default {
  component: IconButton,
  title: TITLE,
  argTypes: {
    icon: iconPrimaryArg,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
  args: {
    icon: ArrowRightOutlined
  }
};

const Template: Story<IIconButtonProps> = (args) => <IconButton {...args} />;

export const Default = Template.bind({});

export const LargeSize = Template.bind({});
LargeSize.args = {
  size: 'large'
};

export const Square = Template.bind({});
Square.args = {
  shape: 'square',
  variant: 'background'
};

export const VariantBackground = Template.bind({});
VariantBackground.args = {
  variant: 'background'
};

export const VariantBlur = Template.bind({});
VariantBlur.args = {
  variant: 'blur'
};

export const Active = Template.bind({});
Active.args = {
  active: true
};

export const Disabled = Template.bind({});
Disabled.args = {
  component: 'button',
  disabled: true
};

export const VariantBackgroundDisabled = Template.bind({});
VariantBackgroundDisabled.args = {
  component: 'button',
  disabled: true,
  variant: 'background'
};