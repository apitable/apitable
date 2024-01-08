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

import React from 'react';
import { Dropdown } from './index';
import { Dropdown as FloatDropdown } from './float_ui';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { IDropdownProps } from './interface';
import { FloatUiTooltip } from '../tooltip/float_ui';
import { Typography } from '../typography';

const COMPONENT_NAME = 'Dropdown';

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
    children: 'Dropdown',
    data: [
      [
        {
          text: 'option 1-1',
        },
        {
          text: 'option 1-2',
        },
        {
          text: 'option 1-3',
        },
      ],
      [
        {
          text: 'option 2-1',
        },
      ],
    ],
  },
};

const Template: Story<IDropdownProps> = (args) => <Dropdown {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: 'default',
};

export const HideArrow = Template.bind({});
HideArrow.args = {
  id: 'hide-arrow',
  arrow: false,
};

export const RightClick = Template.bind({});
RightClick.args = {
  children: 'right click dropdown',
  id: 'right-click',
  trigger: ['contextMenu'],
};

export const SecondaryMenu = Template.bind({});
SecondaryMenu.args = {
  children: 'multi level dropdown',
  id: 'secondary-menu',
  data: [
    [
      {
        text: 'option 1-1',
      },
    ],
    [
      {
        text: 'option 2-1',
        children: [
          {
            text: 'option 2-1-1',
          },
          {
            text: 'option 2-1-2',
          },
          {
            text: 'option 2-1-3',
          },
        ],
      },
    ],
  ],
};

export const DisabledMenu = Template.bind({});
DisabledMenu.args = {
  children: 'disable some options dropdown',
  id: 'disabled-menu',
  data: [
    [
      {
        text: 'option 1-1',
      },
      {
        text: 'option 1-2',
        disabled: true,
      },
      {
        text: 'option 1-3',
        disabled: true,
      },
    ],
    [
      {
        text: 'option 2-1',
      },
    ],
  ],
};

export const FloatDropdownUi = () => {
  return (
    <>
      <br />

      <FloatUiTooltip
        placement={'top'}
        arrow={false}
        content={
          <>
            <Typography variant={'body4'} color={'red'}>
              content
            </Typography>
          </>
        }
      >
        <span>FloatUiTooltip</span>
      </FloatUiTooltip>
      <br />
      <br />
      <br />
      <FloatUiTooltip
        placement={'top'}
        content={
          <>
            <Typography variant={'body4'} color={'red'}>
              content
            </Typography>
          </>
        }
      >
        <span>FloatUiTooltip</span>
      </FloatUiTooltip>
      <FloatDropdown trigger={() => <div>trigger</div>}>
        {() => {
          return <div> overlay</div>;
        }}
      </FloatDropdown>
      <br />
      <br />
      <br />
      <br />
      <FloatDropdown trigger={<div>ddd</div>}>
        {() => {
          return <div> overlay</div>;
        }}
      </FloatDropdown>
    </>
  );
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
          [
            {
              text: 'option 1-1',
              data: '1-1',
              onClick: handleClick,
            },
          ],
          [
            {
              text: 'option 2-1',
              children: [
                {
                  text: 'option 2-1-1',
                  data: '2-1-1',
                  onClick: handleClick,
                },
                {
                  text: 'option 2-1-2',
                  data: '2-1-2',
                  onClick: handleClick,
                },
                {
                  text: 'option 2-1-3',
                  data: '2-1-3',
                  onClick: handleClick,
                },
              ],
            },
          ],
        ]}
      >
        {value || 'please select'}
      </Dropdown>
    </div>
  );
};
