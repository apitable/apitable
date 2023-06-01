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

import React, { useState } from 'react';
import { Pagination } from './index';
import { StoryType } from '../../stories/constants';

const COMPONENT_NAME = 'Pagination';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: Pagination,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/otoIfiHXPZnVwSp3IavgPm/%E3%80%90Component%E3%80%91--02-Web?node-id=1694%3A44165',
    },
  },
};

export const Default = () => {
  return (
    <div>
      <Pagination total={50} />
    </div>
  );
};

export const Total = () => {
  return (
    <div>
      <Pagination showTotal total={50} />
    </div>
  );
};

export const QuickJump = () => {
  return (
    <div>
      <Pagination showQuickJump total={50} />
    </div>
  );
};

export const More = () => {
  return (
    <div>
      <Pagination total={71} />
      <br />
      <Pagination total={171} />
    </div>
  );
};

export const ChangeSize = () => {
  const [size, setSize] = useState(10);
  return (
    <div>
      <Pagination showChangeSize pageSize={size} total={71} onPageSizeChange={(_page, pageSize) => { setSize(pageSize); }} />
    </div>
  );
};

export const Disabled = () => {
  const [size, setSize] = useState(10);
  return (
    <div>
      <Pagination
        showChangeSize
        showQuickJump
        showTotal
        pageSize={size}
        total={171}
        disabled
        onPageSizeChange={(_page, pageSize) => { setSize(pageSize); }}
      />
    </div>
  );
};

export const Complete = () => {
  const [size, setSize] = useState(10);
  return (
    <div>
      <Pagination
        showChangeSize
        showQuickJump
        showTotal
        pageSize={size}
        total={171}
        onPageSizeChange={(_page, pageSize) => { setSize(pageSize); }}
      />
    </div>
  );
};

export const I18n = () => {
  const [size, setSize] = useState(10);
  return (
    <div>
      <Pagination
        showChangeSize
        showQuickJump
        showTotal
        pageSize={size}
        total={171}
        lang="en"
        onPageSizeChange={(_page, pageSize) => { setSize(pageSize); }}
      />
    </div>
  );
};