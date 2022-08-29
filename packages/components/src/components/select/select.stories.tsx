import React from 'react';
import { Select } from './index';
import { Tooltip } from '../tooltip';
import { StoryType } from '../../stories/constants';
import { Story } from '@storybook/react';
import { ISelectProps } from './interface';
import { FavoriteOutlined, WarningTriangleNonzeroFilled } from '@vikadata/icons';

const COMPONENT_NAME = 'Select 下拉框';

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

const data = [];
for (let i = 0; i < 20; i++) {
  data.push({ label: '这是测试的数据'+ i, value: 'opt' + i });
}

export const Default = Template.bind({});

export const WithData = Template.bind({});
WithData.args = {
  options: data
};

export const SelectItem = () => {
  const [value, setValue] = React.useState('opt1');
  return (
    <Select
      options={data}
      value={value}
      onSelected={(option) => {
        setValue(option.value);
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
        setValue(option.value);
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
          label: '这个测试数据比较长这个测试数据比较长比较长',
          value: 'opt'
        },
        ...data,
      ]}
      value={value}
      onSelected={(option) => {
        setValue(option.value);
      }}
      dropdownMatchSelectWidth={false}
      triggerStyle={{ width: 100 }}
    />
  );
};

export const SelectItemWithIcon = () => {
  const [value, setValue] = React.useState();
  return (
    <Select
      options={[
        { label: '这是测试的数据2', value: 'opt2', prefixIcon: <FavoriteOutlined />, suffixIcon: <FavoriteOutlined /> },
        { label: '这是测试的数据3', value: 'opt3', prefixIcon: <FavoriteOutlined />, suffixIcon: <FavoriteOutlined /> },
      ]}
      value={value}
      onSelected={(option) => {
        setValue(option.value);
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
          label: '这个被禁用了',
          value: 'opt',
          disabled: true,
        },
        ...data,
      ]}
      value={value}
      onSelected={(option) => {
        setValue(option.value);
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
          label: '这个被禁用了',
          value: 'opt',
          disabled: true,
          disabledTip: '禁用原因说明'
        },
        ...data,
      ]}
      value={value}
      onSelected={(option) => {
        setValue(option.value);
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
          label: '这个被禁用了',
          value: 'opt',
          disabled: true,
          suffixIcon: (
            <Tooltip content={'禁用原因说明'}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <WarningTriangleNonzeroFilled color="#FFAB00" />
              </span>
            </Tooltip>
          ),
        },
        ...data,
      ]}
      value={value}
      onSelected={(option) => {
        setValue(option.value);
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
          label: '这是一条很长的选项，这是一条很长的选项，这是一条很长的选项',
          value: 'opt',
          prefixIcon: <FavoriteOutlined />,
          suffixIcon: <Tooltip content={'该图标也支持显示额外信息'}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <WarningTriangleNonzeroFilled color="#FFAB00" />
            </span>
          </Tooltip>,
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
    { label: '这是测试的数据1', value: 'opt1' },
    { label: '这是测试的数据2', value: 'opt2' },
    { label: '这是测试的数据3', value: 'opt3' },
    { label: '这是测试的数据4', value: 'opt4' },
    { label: '这是测试的数据5', value: 'opt5' },
    { label: '这是测试的数据6', value: 'opt6' },
    { label: '这是测试的数据7', value: 'opt7' },
    { label: '这是测试的数据8', value: 'opt8' },
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
    { label: '这是测试的数据1', value: 'opt1' },
    { label: '这是测试的数据2', value: 'opt2' },
    { label: '这是测试的数据3', value: 'opt3' },
    { label: '这是测试的数据4', value: 'opt4' },
    { label: '这是测试的数据5', value: 'opt5' },
    { label: '这是测试的数据6', value: 'opt6' },
    { label: '这是测试的数据7', value: 'opt7' },
    { label: '这是测试的数据8', value: 'opt8' },
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
      highlightStyle={{
        backgroundColor: '#7B67EE',
        color: '#fff'
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
    { label: '张三-男', value: 'opt1' },
    { label: '李四-男', value: 'opt2' },
    { label: '翠花-女', value: 'opt3' },
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
      renderValue={renderValue}
    />
  );
};

export const SelectOption = () => {
  const [value, setValue] = React.useState('opt3');

  const options = [
    { label: '这是测试的数据1', value: 'opt1', disabled: true },
    { label: '这是测试的数据2', value: 'opt2' },
    { label: '这是测试的数据3', value: 'opt3' },
    { label: '这是测试的数据4', value: 'opt4' },
    { label: '这是测试的数据5', value: 'opt5' },
    { label: '这是测试的数据6', value: 'opt6' },
    { label: '这是测试的数据7', value: 'opt7' },
    { label: '这是测试的数据8', value: 'opt8' },
  ];

  return (
    <Select
      value={value}
      onSelected={(option) => {
        console.log({ option });
        setValue(option.value);
      }}
      dropdownMatchSelectWidth
      triggerStyle={{ width: 100 }}
    >
      {options.map((option, index) => {
        return (
          <Select.Option
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};

