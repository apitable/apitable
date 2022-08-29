import React, { useState } from 'react';
import { Pagination } from './index';
import { StoryType } from '../../stories/constants';

const COMPONENT_NAME = 'Pagination 翻页';

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
      <Pagination showChangeSize pageSize={size} total={71} onPageSizeChange={(page, pageSize) => { setSize(pageSize); }} />
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
        onPageSizeChange={(page, pageSize) => { setSize(pageSize); }}
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
        onPageSizeChange={(page, pageSize) => { setSize(pageSize); }}
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
        onPageSizeChange={(page, pageSize) => { setSize(pageSize); }}
      />
    </div>
  );
};