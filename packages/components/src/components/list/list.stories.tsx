import React from 'react';
import { List } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { IListProps } from './interface';
import { TextButton } from '../text_button';
import { Box } from '../box';

const COMPONENT_NAME = 'List 列表';

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

const DATA = new Array(5).fill(null).map((_, index) => `列表 ${index + 1}`);

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
  header: <div>头部</div>,
  data: DATA,
  footer: <div>尾部</div>,
  bordered: true,
};

export const WithActions = Template.bind({});
WithActions.args = {
  data: new Array(5).fill(null).map((_, index) => ({
    children: `列表 ${index + 1}`,
    actions: [
      <TextButton size="x-small" color="primary">编辑</TextButton>,
      <TextButton size="x-small" color="danger">删除</TextButton>
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

