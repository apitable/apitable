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