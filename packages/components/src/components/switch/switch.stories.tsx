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
import { Switch } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { ISwitchProps } from './interface';

const COMPONENT_NAME = 'Switch';

const TITLE = `${StoryType.Form}/${COMPONENT_NAME}`;

export default {
  component: Switch,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
};

const Template: Story<ISwitchProps> = (args) => <Switch {...args} />;

export const Default = Template.bind({});

export const DefaultChecked = Template.bind({});
DefaultChecked.args = {
  defaultChecked: true
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  size: 'small'
};

export const CloseDisabled = Template.bind({});
CloseDisabled.args = {
  disabled: true
};

export const OpenDisabled = Template.bind({});
OpenDisabled.args = {
  disabled: true,
  defaultChecked: true
};

export const CloseLoading = Template.bind({});
CloseLoading.args = {
  loading: true
};

export const OpenLoading = Template.bind({});
OpenLoading.args = {
  loading: true,
  defaultChecked: true
};

export const ChangeStatus = () => {
  const [status, setStatus] = React.useState(false);
  return (
    <Switch
      checked={status}
      onClick={(s) => {
        setStatus(s);
        alert(`Status ${s ? 'open' : 'close'}`);
      }}
    />
  );
};
