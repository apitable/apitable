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
import { Alert, showAlert } from './index';
import { Button } from '../button';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { IAlertProps } from './interface';

const COMPONENT_NAME = 'Alert';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: Alert,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
  args: {
    content: 'Scanner for decks of cards with bar codes printed on card edges',
  }
};

const Template: Story<IAlertProps> = (args) => <Alert {...args} />;

export const Default = Template.bind({});

export const SuccessType = Template.bind({});
SuccessType.args = {
  type: 'success'
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  title: 'Scanner for decks of cards with bar codes printed on card edges',
};

export const Closable = Template.bind({});
Closable.args = {
  closable: true
};

export const CloseCallback = Template.bind({});
CloseCallback.args = {
  closable: true,
  onClose: () => alert('I turned off this reminder ⏰')
};

export const ShowAlertFunction = () => {
  return (
    <Button color="primary" onClick={() => {
      showAlert({
        content: 'Scanner for decks of cards with bar codes printed on card edges',
        type: 'warning',
        closable: true,
        duration: 0,
      });
    }}>
      Click to trigger alert
    </Button>
  );
  
};