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
import { DownloadOutlined, LinktableOutlined } from '@apitable/icons';
import { iconArg } from '../../stories/args';
import { LinkButton } from './index';
import { StoryType } from '../../stories/constants';
import { ILinkButtonProps } from './interface';

const COMPONENT_NAME = 'Button';
const BUTTON_TEXT = 'Link Text';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}/LinkButton`;

export default {
  component: LinkButton,
  title: TITLE,
  argTypes: {
    prefixIcon: iconArg,
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

const Template: Story<ILinkButtonProps> = (args) => <LinkButton {...args} />;

export const Default = Template.bind({});

export const ButtonHref = Template.bind({});
ButtonHref.args = {
  href: 'https://apitable.com/',
  children: 'https://apitable.com/',
  target: '_blank'
};

export const ButtonIcon = Template.bind({});
ButtonIcon.args = {
  component: 'button'
};

export const LeftIcon = Template.bind({});
LeftIcon.args = {
  prefixIcon: <LinktableOutlined currentColor />
};

export const RightIcon = Template.bind({});
RightIcon.args = {
  suffixIcon: <DownloadOutlined currentColor/>
};

export const Color = Template.bind({});
Color.args = {
  color: '#FF7A00'
};

export const HideUnderline = Template.bind({});
HideUnderline.args = {
  underline: false
};

export const Block = Template.bind({});
Block.args = {
  component: 'button',
  block: true
};

export const Click = Template.bind({});
Click.args = {
  onClick: () => {
    alert('client event');
  }
};

export const Href = Template.bind({});
HideUnderline.args = {
  href: 'https://apitable.com',
  underline: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true
};

