import React from 'react';
import { Typography, ITypographyProps } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';

const COMPONENT_NAME = 'Typography';

const TITLE = `${StoryType.Design}/${COMPONENT_NAME}`;

export default {
  component: Typography,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  }
};

const Template: Story<ITypographyProps> = (args) => <Typography {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'the secret to happiness is low expectations.'
};

export const Color = Template.bind({});
Color.args = {
  variant: 'h1',
  color: '#7B67EE',
  children: 'H1 title'
};

export const AlignRight = Template.bind({});
AlignRight.args = {
  variant: 'h1',
  align: 'right',
  children: 'H1 title'
};

export const EllipsisDefault = Template.bind({});
EllipsisDefault.args = {
  ellipsis: true,
  variant: 'body1',
  // eslint-disable-next-line max-len
  children: 'Context, not control: If you want to build a ship, do not drum up the people to gather wood, divide the work, and give orders. Instead, teach them to yearn for the vast and endless sea.'
};

export const EllipsisOver3Row = Template.bind({});
EllipsisOver3Row.args = {
  variant: 'body1',
  ellipsis: { rows: 3 },
  // eslint-disable-next-line max-len
  children: 'Context, not control: If you want to build a ship, do not drum up the people to gather wood, divide the work, and give orders. Instead, teach them to yearn for the vast and endless sea.'
};

export const Tooltip = Template.bind({});
Tooltip.args = {
  variant: 'body1',
  ellipsis: { tooltip: 'Knowledge breadth vs knowledge depth' },
  // eslint-disable-next-line max-len
  children: 'Context, not control: If you want to build a ship, do not drum up the people to gather wood, divide the work, and give orders. Instead, teach them to yearn for the vast and endless sea.'
};