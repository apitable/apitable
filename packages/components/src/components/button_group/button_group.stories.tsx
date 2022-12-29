import React from 'react';
import { ButtonGroup } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { IButtonGroupProps } from './interface';
import { Button } from '../button';
import { IconButton } from '../icon_button';
import { LinkButton } from '../link_button';
import { LockOutlined, ShareFilled, RankFilled, WebsiteOutlined } from '@apitable/icons';

const COMPONENT_NAME = 'Button Group';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: ButtonGroup,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
};

const Template: Story<IButtonGroupProps> = (args) => <ButtonGroup {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <Button>Button1</Button>
      <Button>Button2</Button>
      <Button>Button3</Button>
    </>
  )
};

export const WithSeparate = Template.bind({});
WithSeparate.args = {
  withSeparate: true,
  children: (
    <>
      <Button>Button1</Button>
      <Button>Button2</Button>
      <Button>Button3</Button>
    </>
  )
};

export const LinkButtonWithSeparate = Template.bind({});
LinkButtonWithSeparate.args = {
  withSeparate: true,
  children: (
    <>
      <LinkButton component="button" underline={false}>Button1</LinkButton>
      <LinkButton component="button" underline={false}>Button2</LinkButton>
      <LinkButton component="button" underline={false}>Button3</LinkButton>
    </>
  )
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  withSeparate: true,
  withBorder: true,
  children: (
    <>
      <IconButton icon={LockOutlined}/>
      <IconButton icon={ShareFilled}/>
      <IconButton icon={RankFilled}/>
      <IconButton icon={WebsiteOutlined}/>
    </>
  )
};