import React from 'react';
import { Avatar } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { IAvatarProps } from './interface';
import { ExpandOutlined } from '@apitable/icons';
import { AvatarGroup } from './avatar_group';

const LOGO = 'https://avatars.githubusercontent.com/u/89725681';

const COMPONENT_NAME = 'Avatar';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: Avatar,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};

const Template: Story<IAvatarProps> = (args) => <Avatar {...args} />;

export const Image = Template.bind({});
Image.args = {
  src: LOGO,
  alt: 'apitable logo'
};

export const SquareShape = Template.bind({});
SquareShape.args = {
  src: LOGO,
  alt: 'apitable logo',
  shape: 'square'
};

export const ImageSSize = Template.bind({});
ImageSSize.args = {
  src: LOGO,
  alt: 'apitable logo',
  size: 's'
};

export const SingleText = Template.bind({});
SingleText.args = {
  children: 'V',
};

export const CustomTextBackground = Template.bind({});
CustomTextBackground.args = {
  children: 'APITable',
  style: { background: '#ccc' }
};

export const Icon = Template.bind({});
Icon.args = {
  icon: <ExpandOutlined />,
};

export const CustomIconBackground = Template.bind({});
CustomIconBackground.args = {
  icon: <ExpandOutlined />,
  style: { background: '#ccc' }
};

const AvatarGroupTemplate: Story = (args) => <AvatarGroup {...args} />;

export const AvatarGroupSetting = AvatarGroupTemplate.bind({});
AvatarGroupSetting.args = {
  max: 3,
  size: 'xs',
  maxStyle: { background: '#ccc' },
  children: [
    <Avatar src="https://avatars.githubusercontent.com/u/89725681" alt="apitable avatar" />,
    <Avatar src="https://avatars.githubusercontent.com/u/89725681" alt="apitable avatar" />,
    <Avatar src="https://avatars.githubusercontent.com/u/89725681" alt="apitable avatar" />,
    <Avatar src="https://avatars.githubusercontent.com/u/89725681" alt="apitable avatar" />,
    <Avatar src="https://avatars.githubusercontent.com/u/89725681" alt="apitable avatar" />,
    <Avatar src="https://avatars.githubusercontent.com/u/89725681" alt="apitable avatar" />
  ]
};