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