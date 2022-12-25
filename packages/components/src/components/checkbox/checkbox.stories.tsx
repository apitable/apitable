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
import { Checkbox } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { ICheckboxProps } from './interface';

const COMPONENT_NAME = 'Checkbox';

const TITLE = `${StoryType.Form}/${COMPONENT_NAME}`;

export default {
  component: Checkbox,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
};

const Template: Story<ICheckboxProps> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'default checkbox',
};

export const DefaultChecked = Template.bind({});
DefaultChecked.args = {
  checked: true,
  children: 'default checkbox',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  children: 'disabled checkbox',
};

export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
  disabled: true,
  checked: true,
  children: 'disabled checkbox',
};

export const CustomSizeTo40 = Template.bind({});
CustomSizeTo40.args = {
  size: 40,
  children: '40px size checkbox',
};

export const CustomSizeToRed = Template.bind({});
CustomSizeToRed.args = {
  color: 'red',
  children: 'red checkbox',
};

export const Callback = Template.bind({});
Callback.args = {
  onChange: val => alert(`status：${val ? 'checked': 'cancel checked'}`),
  children: 'listen checkbox',
};