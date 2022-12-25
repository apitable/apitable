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
import { List } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { IListProps } from './interface';
import { TextButton } from '../text_button';
import { Box } from '../box';

const COMPONENT_NAME = 'List';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: List,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  }
};

const Template: Story<IListProps> = (args) => <List {...args} />;

const DATA = new Array(5).fill(null).map((_, index) => `List ${index + 1}`);

export const Default = Template.bind({});
Default.args = {
  data: DATA,
};

export const WithBordered = Template.bind({});
WithBordered.args = {
  data: DATA,
  bordered: true,
};

export const WithFooterHeader = Template.bind({});
WithFooterHeader.args = {
  header: <div>Header</div>,
  data: DATA,
  footer: <div>Footer</div>,
  bordered: true,
};

export const WithActions = Template.bind({});
WithActions.args = {
  data: new Array(5).fill(null).map((_, index) => ({
    children: `List ${index + 1}`,
    actions: [
      <TextButton size="x-small" color="primary">Edit</TextButton>,
      <TextButton size="x-small" color="danger">Delete</TextButton>
    ],
  })),
  bordered: true,
};

export const CustomListItem = Template.bind({});
CustomListItem.args = {
  data: DATA,
  bordered: true,
  renderItem: (item, index) => (
    <Box
      key={index}
      padding={3}
      bg="#7B67EE"
      color="#fff"
      borderBottom="1px dashed #fff"
    >
      {item}
    </Box>
  )
};

