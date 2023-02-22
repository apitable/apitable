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
import { Space } from './index';
import { StoryType } from '../../stories/constants';
import { ISpaceProps } from './interface';
import { Box, Button, Checkbox, Switch } from '../index';
import { Radio } from '../radio/radio';
import { LinkButton } from '../link_button';
import { LinktableOutlined } from '@apitable/icons';

const COMPONENT_NAME = 'Space';

const TITLE = `${StoryType.Design}/${COMPONENT_NAME}`;

const Card = () => (
  <Box
    width="120px"
    height="80px"
    border="1px solid #ccc"
    textAlign="center"
    lineHeight="80px"
  >
    120px x 80px
  </Box>
);

export default {
  component: Space,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
  args: {
    children: [
      'Text',
      <Button color="primary">Button</Button>,
      <Switch />,
      <Checkbox>Checkbox</Checkbox>,
      <Radio>Radio</Radio>
    ]
  }
};

const Template: Story<ISpaceProps> = (args) => <Space {...args} />;

export const DefaultSize8 = Template.bind({});

export const SetSize32 = Template.bind({});
SetSize32.args = {
  size: 32,
};

export const VerticalSize16 = Template.bind({});
VerticalSize16.args = {
  vertical: true,
  size: 16,
};

export const Wrap = Template.bind({});
Wrap.args = {
  wrap: true,
  children: new Array(20).fill(null).map((_, index) => (
    <Card key={index}/>
  ))
};

export const SetRowColumnSpace = Template.bind({});
SetRowColumnSpace.args = {
  size: [16, 32],
  wrap: true,
  children: new Array(20).fill(null).map((_, index) => (
    <Card key={index}/>
  ))
};

export const Split = Template.bind({});
Split.args = {
  split: true,
  children: new Array(5).fill(null).map((_, index) => (
    <LinkButton underline={false} prefixIcon={<LinktableOutlined currentColor />} key={index}>Link href</LinkButton>
  ))
};

export const AlignStart = Template.bind({});
AlignStart.args = {
  align: 'start',
  children: (
    <>
      <span>Text</span>
      <Button color="primary">Button</Button>
      <Box backgroundColor="#ccc" padding="40px 8px 16px 32px">Box</Box>
    </>
  )
};

export const AlignCenter = Template.bind({});
AlignCenter.args = {
  align: 'center',
  children: (
    <>
      <span>Text</span>
      <Button color="primary">Button</Button>
      <Box backgroundColor="#ccc" padding="40px 8px 16px 32px">Box</Box>
    </>
  )
};

export const AlignEnd = Template.bind({});
AlignEnd.args = {
  align: 'end',
  children: (
    <>
      <span>Text</span>
      <Button color="primary">Button</Button>
      <Box backgroundColor="#ccc" padding="40px 8px 16px 32px">Box</Box>
    </>
  )
};

export const AlignBaseline = Template.bind({});
AlignBaseline.args = {
  align: 'baseline',
  children: (
    <>
      <span>Text</span>
      <Button color="primary">Button</Button>
      <Box backgroundColor="#ccc" padding="40px 8px 16px">Box</Box>
    </>
  )
};

export const VerticalAlignStart = Template.bind({});
VerticalAlignStart.args = {
  align: 'start',
  vertical: true,
  children: (
    <>
      <span>Text</span>
      <Button color="primary">Button</Button>
      <Box backgroundColor="#ccc" padding="40px 8px 16px 32px">Box</Box>
    </>
  )
};

export const VerticalAlignCenter = Template.bind({});
VerticalAlignCenter.args = {
  align: 'center',
  vertical: true,
  children: (
    <>
      <span>Text</span>
      <Button color="primary">Button</Button>
      <Box backgroundColor="#ccc" padding="40px 8px 16px 32px">Box</Box>
    </>
  )
};

export const VerticalAlignEnd = Template.bind({});
VerticalAlignEnd.args = {
  align: 'end',
  vertical: true,
  children: (
    <>
      <span>Text</span>
      <Button color="primary">Button</Button>
      <Box backgroundColor="#ccc" padding="40px 8px 16px 32px">Box</Box>
    </>
  )
};

export const SetComponentUlLi = Template.bind({});
SetComponentUlLi.args = {
  component: 'ul',
  vertical: true,
  children: new Array(10).fill(null).map((_, index) => (
    <Space key={index} component="li" style={{ borderBottom: '1px solid #ccc' }}>
      list {index + 1}
    </Space>
  ))
};