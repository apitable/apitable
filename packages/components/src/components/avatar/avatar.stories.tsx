/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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