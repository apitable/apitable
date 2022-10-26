import React from 'react';
import { Loading } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';

const COMPONENT_NAME = 'Loading';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: Loading,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
};

const Template: Story = (args) => <Loading {...args} />;

export const Default = Template.bind({});

export const InheritColor = () => {
  return (
    <div style={{ color: 'red' }}>
      <Loading currentColor/>
    </div>
  );
};

export const SetStrokeWidth = Template.bind({});
SetStrokeWidth.args = {
  strokeWidth: 1
};