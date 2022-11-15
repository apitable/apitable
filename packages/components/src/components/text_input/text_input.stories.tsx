import React from 'react';
import { TextInput } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { ITextInputProps } from './text_input.interface';
import { PhonenumberFilled } from '@apitable/icons';

const COMPONENT_NAME = 'TextInput';

const TITLE = `${StoryType.Form}/${COMPONENT_NAME}`;

export default {
  component: TextInput,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
};

const Template: Story<ITextInputProps> = (args) => <TextInput {...args} />;

export const Default = Template.bind({});

export const Placeholder = Template.bind({});
Placeholder.args = {
  placeholder: 'please input something'
};

export const Block = Template.bind({});
Block.args = {
  block: true,
  placeholder: 'please input something'
};

export const LineStyle = Template.bind({});
LineStyle.args = {
  lineStyle: true,
  placeholder: 'please input something'
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  size: 'small',
  placeholder: 'please input something'
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  size: 'large',
  placeholder: 'please input something'
};

export const Prefix = Template.bind({});
Prefix.args = {
  prefix: <PhonenumberFilled />,
  placeholder: 'please input something'
};

export const Suffix = Template.bind({});
Suffix.args = {
  suffix: <PhonenumberFilled />,
  placeholder: 'please input something'
};

export const AddonBefore = Template.bind({});
AddonBefore.args = {
  addonBefore: <div>http://</div>,
  prefix: <PhonenumberFilled />,
  placeholder: 'please input something'
};

export const AddonAfter = Template.bind({});
AddonAfter.args = {
  addonAfter: <div>.com</div>,
  prefix: <PhonenumberFilled />,
  placeholder: 'please input something'
};

export const ErrorStatus = Template.bind({});
ErrorStatus.args = {
  error: true,
  prefix: <PhonenumberFilled />,
  placeholder: 'please input something'
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  prefix: <PhonenumberFilled />,
  placeholder: 'please input something'
};