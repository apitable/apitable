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
import { TextInput } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { ITextInputProps } from './text_input.interface';
import { TelephoneOutlined } from '@apitable/icons';

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
  prefix: <TelephoneOutlined />,
  placeholder: 'please input something'
};

export const Suffix = Template.bind({});
Suffix.args = {
  suffix: <TelephoneOutlined />,
  placeholder: 'please input something'
};

export const AddonBefore = Template.bind({});
AddonBefore.args = {
  addonBefore: <div>http://</div>,
  prefix: <TelephoneOutlined />,
  placeholder: 'please input something'
};

export const AddonAfter = Template.bind({});
AddonAfter.args = {
  addonAfter: <div>.com</div>,
  prefix: <TelephoneOutlined />,
  placeholder: 'please input something'
};

export const ErrorStatus = Template.bind({});
ErrorStatus.args = {
  error: true,
  prefix: <TelephoneOutlined />,
  placeholder: 'please input something'
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  prefix: <TelephoneOutlined />,
  placeholder: 'please input something'
};