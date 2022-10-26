import { Skeleton, ISkeletonProps } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import React from 'react';

const COMPONENT_NAME = 'Skeleton';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: Skeleton,
  title: TITLE,
};

const Template: Story<ISkeletonProps> = (args) => <Skeleton {...args} />;

export const PrimarySkeleton = Template.bind({});
PrimarySkeleton.args = {
  count: 2,
  duration: 1
};

export const Multi = () => {
  return (
    <>
      <Skeleton count={1} height="24px" />
      <Skeleton count={2} style={{ marginTop: '24px' }} height="80px" />
    </>
  );
};

export const Image = () => {
  return (
    <>
      <Skeleton image style={{ width: '240px', height: '240px' }} />
      <Skeleton image circle style={{ width: '80px', height: '80px' }} />
    </>
  );
};

export const Paragraph = () => {
  return (
    <>
      <Skeleton count={1} width="38%" />
      <Skeleton count={2} />
      <Skeleton count={1} width="61%"/>
    </>
  );
};

export const ImageWithParagraph = () => {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Skeleton image style={{ width: '240px', height: '240px' }} />
        <div style={{ flexGrow: 1, marginLeft: 8 }}>
          <Skeleton count={1} width="38%" />
          <Skeleton count={2} />
          <Skeleton count={1} width="61%"/>
        </div>
      </div>
    </>
  );
};