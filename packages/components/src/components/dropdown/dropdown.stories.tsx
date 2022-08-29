import React from 'react';
import { Dropdown } from './index';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { IDropdownProps } from './interface';

const COMPONENT_NAME = 'Dropdown 下拉菜单';

const TITLE = `${StoryType.BaseComponent}/${COMPONENT_NAME}`;

export default {
  component: Dropdown,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
  args: {
    children: '下拉菜单',
    data: [
      [{
        text: '选项 1-1',
      }, {
        text: '选项 1-2',
      }, {
        text: '选项 1-3',
      }],
      [{
        text: '选项 2-1',
      }],
    ]
  }
};

const Template: Story<IDropdownProps> = (args) => <Dropdown {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: 'default'
};

export const HideArrow = Template.bind({});
HideArrow.args = {
  id: 'hide-arrow',
  arrow: false,
};

export const RightClick = Template.bind({});
RightClick.args = {
  children: '右键下拉菜单',
  id: 'right-click',
  trigger: ['contextMenu']
};

export const SecondaryMenu = Template.bind({});
SecondaryMenu.args = {
  children: '多层下拉菜单',
  id: 'secondary-menu',
  data: [
    [{
      text: '选项 1-1',
    }],
    [{
      text: '选项 2-1',
      children: [
        {
          text: '选项 2-1-1',
        },
        {
          text: '选项 2-1-2',
        },
        {
          text: '选项 2-1-3',
        },
      ]
    }],
  ]
};

export const DisabledMenu = Template.bind({});
DisabledMenu.args = {
  children: '禁用部分选项',
  id: 'disabled-menu',
  data: [
    [{
      text: '选项 1-1',
    }, {
      text: '选项 1-2',
      disabled: true,
    }, {
      text: '选项 1-3',
      disabled: true,
    }],
    [{
      text: '选项 2-1',
    }],
  ]
};

export const SelectMenuValue = () => {
  const [value, setValue] = React.useState('');
  const handleClick = ({ data }) => {
    setValue(data);
  };
  return (
    <div>
      <Dropdown
        id="select-menu-value"
        data={[
          [{
            text: '选项 1-1',
            data: '1-1',
            onClick: handleClick,
          }],
          [{
            text: '选项 2-1',
            children: [
              {
                text: '选项 2-1-1',
                data: '2-1-1',
                onClick: handleClick,
              },
              {
                text: '选项 2-1-2',
                data: '2-1-2',
                onClick: handleClick,
              },
              {
                text: '选项 2-1-3',
                data: '2-1-3',
                onClick: handleClick,
              },
            ]
          }],
        ]}
      >
        {value || '请选择'}
      </Dropdown>
    </div>
  );
};

