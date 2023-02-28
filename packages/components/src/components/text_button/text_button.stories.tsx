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
import { Story } from '@storybook/react';
import { DownloadOutlined } from '@apitable/icons';
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
  prefixIcon: <DownloadOutlined/>
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