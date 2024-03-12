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
import { Select, DropdownSelect, SearchSelect } from './index';
import { Tooltip } from '../tooltip';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { ISelectProps } from './interface';
import { Box } from '../box';
import { StarOutlined, WarnCircleFilled } from '@apitable/icons';
import { MultipleSelect } from './dropdown/multiple';

const COMPONENT_NAME = 'Select';

const TITLE = `${StoryType.Form}/${COMPONENT_NAME}`;

export default {
  component: Select,
  title: TITLE,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/LightMode?node-id=247%3A0',
    },
  },
};

const Template: Story<ISelectProps> = (args) => <Select {...args} />;

const data: {
  label: string;
  value: string;
}[] = [];
for (let i = 0; i < 20; i++) {
  data.push({ label: 'Test data' + i, value: 'opt' + i });
}

export const Default = Template.bind({});

export const WithData = Template.bind({});
WithData.args = {
  options: data,
};

export const MultipleSelectDemo = () => {
  const [value, setValue] = React.useState(['value4', 'value5']);
  return (
    <MultipleSelect
      placeholder={'请选择'}
      value={value}
      options={[
        {
          value: 'value1',
          label: 'a1',
        },
        {
          value: 'value2',
          label: '3',
        },
        {
          value: 'value5',
          label: 'a5',
        },
        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value5',
          label: 'a',
        },
        {
          value: 'value4',
          label: 'b',
        },
      ]}
      onChange={(option) => {
        console.log('options', option);
        setValue(option as any);
      }}
    />
  );
};

export const SearchSelectDemo = () => {
  const [value, setValue] = React.useState('value1');
  return (
    <SearchSelect
      value={value}
      list={[
        {
          value: 'value1',
          label: 'a1',
        },
        {
          value: 'value2',
          label: '3',
        },
        {
          value: 'value5',
          label: 'a5',
        },
        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },

        {
          value: 'value1',
          label: 'a',
        },
        {
          value: 'value2',
          label: 'b',
        },
      ]}
      onChange={(option) => {
        setValue(option.value as string);
      }}
    >
      <div tabIndex={-1}>
        <button>dddddddddddddddddddddddddddddddddddddddddddddddddd: {value}</button>
      </div>
    </SearchSelect>
  );
};

export const DropdownSelectDisabled = () => {
  const [value, setValue] = React.useState('opt15');
  return (
    <DropdownSelect
      disabled
      options={data}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
    />
  );
};

export const DropdownSelectMaxContent = () => {
  const data: {
    label: string;
    value: string;
  }[] = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      label:
        'Test dataTest dataTest dataTest dataTest dataTest dataTest dataTest dataTest dataTest dataTest dataTest dataTest dataTest dataTest dataTest dataTest data' +
        i,
      value: 'opt' + i,
    });
  }
  const data1: {
    label: string;
    value: string;
  }[] = [];
  for (let i = 0; i < 20; i++) {
    data1.push({ label: 'Test ' + i, value: 'opt' + i });
  }
  const [value, setValue] = React.useState('opt15');
  return (
    <Box width={'80px'}>
      <DropdownSelect
        dropDownOptions={{
          placement: 'bottom-start',
        }}
        panelOptions={{
          maxWidth: '300px',
        }}
        dropdownMatchSelectWidth={false}
        options={data}
        value={value}
        onSelected={(option) => {
          setValue(option.value as string);
        }}
      />
      <DropdownSelect
        dropdownMatchSelectWidth={false}
        panelOptions={{
          maxWidth: '300px',
        }}
        dropDownOptions={{
          placement: 'bottom-start',
        }}
        options={data1}
        value={value}
        onSelected={(option) => {
          setValue(option.value as string);
        }}
      />
    </Box>
  );
};

export const DropdownSelectItem = () => {
  const [value, setValue] = React.useState('opt15');
  return (
    <DropdownSelect
      options={data}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
    />
  );
};

export const SelectItem = () => {
  const [value, setValue] = React.useState('opt15');
  return (
    <Select
      options={data}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
    />
  );
};

export const MatchWidth = () => {
  const [value, setValue] = React.useState('opt1');
  return (
    <Select
      options={data}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
      dropdownMatchSelectWidth
      triggerStyle={{ width: 100 }}
    />
  );
};

export const NotMatchWidth = () => {
  const [value, setValue] = React.useState('opt1');
  return (
    <Select
      options={[
        {
          label: 'Neither snow, nor rain, nor heat, nor gloom of night keeps these hackers from the swift completion of their code.',
          value: 'opt',
        },
        ...data,
      ]}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
      dropdownMatchSelectWidth={false}
      triggerStyle={{ width: 100 }}
    />
  );
};

export const SelectItemWithIcon = () => {
  const [value, setValue] = React.useState<string>('');
  return (
    <Select
      options={[
        { label: 'The quick shall inherit the Earth', value: 'opt2', prefixIcon: <StarOutlined />, suffixIcon: <StarOutlined /> },
        { label: 'Move fast and break things', value: 'opt3', prefixIcon: <StarOutlined />, suffixIcon: <StarOutlined /> },
      ]}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
      dropdownMatchSelectWidth={false}
      triggerStyle={{ width: 100 }}
    />
  );
};

export const DisabledSelectItem = () => {
  const [value, setValue] = React.useState('opt1');
  return (
    <Select
      options={[
        {
          label: 'this option is disabled',
          value: 'opt',
          disabled: true,
        },
        ...data,
      ]}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
      dropdownMatchSelectWidth={false}
      triggerStyle={{ width: 100 }}
    />
  );
};

export const DisabledSelectItemWithTip = () => {
  const [value, setValue] = React.useState('opt1');
  return (
    <Select
      options={[
        {
          label: 'this option is disabled',
          value: 'opt',
          disabled: true,
          disabledTip: 'option disabled reason',
        },
        ...data,
      ]}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
      dropdownMatchSelectWidth={false}
      triggerStyle={{ width: 100 }}
    />
  );
};

export const DisabledSelectIconWithTip = () => {
  const [value, setValue] = React.useState('opt1');
  return (
    <Select
      options={[
        {
          label: 'this option is disabled',
          value: 'opt',
          disabled: true,
          suffixIcon: (
            <Tooltip content={'option disabled reason'}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <WarnCircleFilled color="#FFAB00" />
              </span>
            </Tooltip>
          ),
        },
        ...data,
      ]}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
      dropdownMatchSelectWidth={false}
      triggerStyle={{ width: 100 }}
    />
  );
};

export const DisabledSelect = () => {
  return (
    <Select
      options={[
        {
          // eslint-disable-next-line max-len
          label:
            'The back still says the name of a different technology company, one that came before us,left as a reminder that if we fail, someday someone might replace us.',
          value: 'opt',
          prefixIcon: <StarOutlined />,
          suffixIcon: (
            <Tooltip content={'This icon also supports the display of additional information'}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <WarnCircleFilled color="#FFAB00" />
              </span>
            </Tooltip>
          ),
        },
      ]}
      value="opt"
      triggerStyle={{ width: 100 }}
      disabled
    />
  );
};

export const Search = () => {
  const [value, setValue] = React.useState<any>('');

  const options = [
    { label: 'Test data 1', value: 'opt1' },
    { label: 'Test data 2', value: 'opt2' },
    { label: 'Test data 3', value: 'opt3' },
    { label: 'Test data 4', value: 'opt4' },
    { label: 'Test data 5', value: 'opt5' },
    { label: 'Test data 6', value: 'opt6' },
    { label: 'Test data 7', value: 'opt7' },
    { label: 'Test data 8', value: 'opt8' },
    { label: 'abcdefg', value: 'opt9' },
    { label: 'ABCDEFG', value: 'opt10' },
  ];

  return (
    <Select
      options={options}
      value={value}
      onSelected={(option) => {
        setValue(option.value);
      }}
      dropdownMatchSelectWidth
      triggerStyle={{ width: 100 }}
      openSearch
    />
  );
};

export const SearchCustomHighlightStyle = () => {
  const [value, setValue] = React.useState('');

  const options = [
    { label: 'Test data 1', value: 'opt1' },
    { label: 'Test data 2', value: 'opt2' },
    { label: 'Test data 3', value: 'opt3' },
    { label: 'Test data 4', value: 'opt4' },
    { label: 'Test data 5', value: 'opt5' },
    { label: 'Test data 6', value: 'opt6' },
    { label: 'Test data 7', value: 'opt7' },
    { label: 'Test data 8', value: 'opt8' },
    { label: 'abcdefg', value: 'opt9' },
    { label: 'ABCDEFG', value: 'opt10' },
  ];

  return (
    <Select
      options={options}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
      highlightStyle={{
        backgroundColor: '#7B67EE',
        color: '#fff',
      }}
      dropdownMatchSelectWidth
      triggerStyle={{ width: 100 }}
      openSearch
    />
  );
};

export const FormatSelectItem = () => {
  const [value, setValue] = React.useState('');

  const renderValue = (option) => {
    return option.label.split('-')[0];
  };

  const options = [
    { label: 'Tom-male', value: 'opt1' },
    { label: 'Jonson-male', value: 'opt2' },
    { label: 'Allen-female', value: 'opt3' },
  ];

  return (
    <Select
      options={options}
      value={value}
      onSelected={(option) => {
        setValue(option.value as string);
      }}
      dropdownMatchSelectWidth
      triggerStyle={{ width: 100 }}
      renderValue={renderValue}
    />
  );
};

export const SelectOption = () => {
  const [value, setValue] = React.useState('opt3');

  const options = [
    { label: 'Test data 1', value: 'opt1', disabled: true },
    { label: 'Test data 2', value: 'opt2' },
    { label: 'Test data 3', value: 'opt3' },
    { label: 'Test data 4', value: 'opt4' },
    { label: 'Test data 5', value: 'opt5' },
    { label: 'Test data 6', value: 'opt6' },
    { label: 'Test data 7', value: 'opt7' },
    { label: 'Test data 8', value: 'opt8' },
  ];

  return (
    <Select
      value={value}
      onSelected={(option) => {
        console.log({ option });
        setValue(option.value as string);
      }}
      dropdownMatchSelectWidth
      triggerStyle={{ width: 100 }}
    >
      {options.map((option, index) => {
        return (
          <Select.Option value={option.value} disabled={option.disabled} currentIndex={index}>
            {option.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};
