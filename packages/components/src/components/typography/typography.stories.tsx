import React from 'react';
import { Typography, ITypographyProps } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';

const COMPONENT_NAME = 'Typography 排版';

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
  children: '幸福的秘诀就是永远抱有低期望值。（the secret to happiness is low expectations.）'
};

export const Color = Template.bind({});
Color.args = {
  variant: 'h1',
  color: '#7B67EE',
  children: 'H1 一级标题'
};

export const AlignRight = Template.bind({});
AlignRight.args = {
  variant: 'h1',
  align: 'right',
  children: 'H1 一级标题'
};

export const EllipsisDefault = Template.bind({});
EllipsisDefault.args = {
  ellipsis: true,
  variant: 'body1',
  // eslint-disable-next-line max-len
  children: '全能程序员的优势，判断正确的仰角 θ，使得两点之间距离最短；特长程序员的优势是前进速度 r，可以在既定道路上做到快速前进。所以，知识的广度能告诉你什么是正确的方向，知识的深度则可以让你在该方向上快速前进。对于长期而艰巨的项目，走得快固然重要，但更重要的是走对方向。如果仰角 θ 不对，走得再快也没用，因为一开始就走错方向，后期必须停下来校正方向，甚至可能永远到达不了目标，白白浪费了生命'
};

export const EllipsisOver3Row = Template.bind({});
EllipsisOver3Row.args = {
  variant: 'body1',
  ellipsis: { rows: 3 },
  // eslint-disable-next-line max-len
  children: '全能程序员的优势，判断正确的仰角 θ，使得两点之间距离最短；特长程序员的优势是前进速度 r，可以在既定道路上做到快速前进。所以，知识的广度能告诉你什么是正确的方向，知识的深度则可以让你在该方向上快速前进。对于长期而艰巨的项目，走得快固然重要，但更重要的是走对方向。如果仰角 θ 不对，走得再快也没用，因为一开始就走错方向，后期必须停下来校正方向，甚至可能永远到达不了目标，白白浪费了生命'
};

export const Tooltip = Template.bind({});
Tooltip.args = {
  variant: 'body1',
  ellipsis: { tooltip: '知识广度 vs 知识深度' },
  // eslint-disable-next-line max-len
  children: '全能程序员的优势，判断正确的仰角 θ，使得两点之间距离最短；特长程序员的优势是前进速度 r，可以在既定道路上做到快速前进。所以，知识的广度能告诉你什么是正确的方向，知识的深度则可以让你在该方向上快速前进。对于长期而艰巨的项目，走得快固然重要，但更重要的是走对方向。如果仰角 θ 不对，走得再快也没用，因为一开始就走错方向，后期必须停下来校正方向，甚至可能永远到达不了目标，白白浪费了生命'
};