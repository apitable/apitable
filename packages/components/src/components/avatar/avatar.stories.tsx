import React from 'react';
import { Avatar } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { IAvatarProps } from './interface';
import { ExpandOutlined } from '@vikadata/icons';
import { AvatarGroup } from './avatar_group';

const LOGO = 'https://s1.vika.cn/space/2021/12/02/645bf8779e814a8c86c6c996ec739f9a';

const COMPONENT_NAME = 'Avatar';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: Avatar,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/otoIfiHXPZnVwSp3IavgPm/Vika-Components---01---Web?node-id=2%3A6076',
    },
  },
};

const Template: Story<IAvatarProps> = (args) => <Avatar {...args} />;

export const Image = Template.bind({});
Image.args = {
  src: LOGO,
  alt: 'vika logo'
};

export const SquareShape = Template.bind({});
SquareShape.args = {
  src: LOGO,
  alt: 'vika logo',
  shape: 'square'
};

export const ImageSSize = Template.bind({});
ImageSSize.args = {
  src: LOGO,
  alt: 'vika logo',
  size: 's'
};

export const SingleText = Template.bind({});
SingleText.args = {
  children: 'V',
};

export const CustomTextBackground = Template.bind({});
CustomTextBackground.args = {
  children: 'VIKA',
  style: { background: '#ccc' }
};

export const Icon = Template.bind({});
Icon.args = {
  icon: <ExpandOutlined />,
};

export const CustomIconBackground = Template.bind({});
CustomIconBackground.args = {
  icon: <ExpandOutlined />,
  style: { background: '#ccc' }
};

const AvatarGroupTemplate: Story = (args) => <AvatarGroup {...args} />;

export const AvatarGroupSetting = AvatarGroupTemplate.bind({});
AvatarGroupSetting.args = {
  max: 3,
  size: 'xs',
  maxStyle: { background: '#ccc' },
  children: [
    <Avatar src="https://s1.vika.cn/space/2021/03/10/61a8aae11da2439ebb4df35b9075587d" alt="vika avatar" />,
    <Avatar src="https://s1.vika.cn/space/2020/09/11/e6aa3037a38f45acb65324ea314aea58" alt="vika avatar" />,
    <Avatar src="https://s1.vika.cn/space/2020/09/11/41e723917dc742d2974e41abab8cf60b" alt="vika avatar" />,
    <Avatar src="https://s1.vika.cn/space/2020/09/11/4dce50e4ec4649b9a408a494aca28183" alt="vika avatar" />,
    <Avatar src="https://s1.vika.cn/space/2020/09/11/e4d073b1fa674bc884a8c194e9248ecf" alt="vika avatar" />,
    <Avatar src="https://s1.vika.cn/space/2020/09/11/31a1acb4734c4dd3ae9538299282b39e" alt="vika avatar" />
  ]
};