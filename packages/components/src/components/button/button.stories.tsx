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
import { Button } from './index';
import { StoryType } from '../../stories/constants';
import { iconArg, iconComponents } from '../../stories/args';
import { Story } from '@storybook/react';
import { IButtonProps } from './interface';
import { orange } from '../../colors';

const COMPONENT_NAME = 'Button';
const BUTTON_TEXT = 'Default Button';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}/Base Button`;

export default {
  component: Button,
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

const Template: Story<IButtonProps> = (args) => <Button {...args} />;

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  color: 'primary',
};

export const DefaultButton = Template.bind({});

export const JellyButton = Template.bind({});
JellyButton.args = {
  variant: 'jelly'
};

export const RoundShape = Template.bind({});
RoundShape.args = {
  shape: 'round',
  color: 'primary',
};

export const SmallSizeButton = Template.bind({});
SmallSizeButton.args = {
  size: 'small',
  color: 'primary',
};

export const DisabledButton = Template.bind({});
DisabledButton.args = {
  disabled: true,
  color: 'primary',
};

export const PrefixIconButton = Template.bind({});
PrefixIconButton.args = {
  color: 'primary',
  variant: 'fill',
  prefixIcon: iconComponents.WebOutlined
};

export const SuffixIconButton = Template.bind({});
SuffixIconButton.args = {
  color: 'primary',
  variant: 'fill',
  suffixIcon: iconComponents.WebOutlined
};

export const BlockButton = Template.bind({});
BlockButton.args = {
  color: 'primary',
  variant: 'fill',
  block: true
};

export const LoadingButton = Template.bind({});
LoadingButton.args = {
  color: 'primary',
  variant: 'fill',
  loading: true
};

export const PaletteCustomColor = Template.bind({});
PaletteCustomColor.args = {
  color: orange[500]
};

export const SupportFormSubmit = () => (
  <form onSubmit={() => {
    alert('Trigger form submit');
  }}>
    <Button htmlType="submit">Submit</Button>
  </form>
);