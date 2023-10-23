import React from 'react';
import { Box, Dropdown, useTheme } from '@apitable/components';
import { ISelectField, ISelectFieldBaseOpenValue, getFieldOptionColor, ISelectFieldOption, FieldType, FOperator } from '@apitable/core';
import { ChevronDownOutlined, CheckOutlined } from '@apitable/icons';

import { CellOptions } from 'ui/cell_value';
import { IFilterSelectProps } from './interface';
import { IOption, ISelectOptions } from 'ui/cell_value/cell_options/interface';
import { FilterInputWrap, OptionItemWrap, SelectPopupContainer } from './styled';

const getSelectOptions = (value: string[] | null, options: IOption[]) => {
  return (value || []).map(optionId => {
    const option = options.find(option => option.id === optionId);
    if (!option) {
      return null;
    }
    return {
      id: optionId,
      name: option.name,
      color: getFieldOptionColor(option.color)
    } as ISelectFieldBaseOpenValue;
  }).filter(v => Boolean(v));
};

export const FilterSelect: React.FC<IFilterSelectProps> = (props) => {
  const { color } = useTheme();
  const { value, field, onChange, operator } = props;
  const isMulti = field.type === FieldType.MultiSelect || [FOperator.Contains, FOperator.DoesNotContain].includes(operator);

  return (
    <Dropdown
      options={{
        placement: 'bottom',
        autoWidth: true,
        arrow: false
      }}
      trigger={
        <FilterInputWrap pointer>
          <Box flex={1} padding={'8px 10px'}>
            {Boolean(value) &&
                <SelectValueBox
                  options={field.property.options}
                  selectOptions={getSelectOptions(value, field.property.options) as ISelectFieldBaseOpenValue[]}
                />}
          </Box>
          <Box display={'flex'} alignItems={'center'} paddingRight={'10px'}>
            <ChevronDownOutlined size={16} color={color.black[300]} />
          </Box>
        </FilterInputWrap>
      }
    >{
        () => (
          <OptionList isMulti={isMulti} field={field as ISelectField} value={value} onChange={(v) => {
            onChange.length === 0 ? onChange(null) : onChange(v);
          }}/>)}
    </Dropdown>
  );
};

interface ISelectValueBoxProps {
  options?: IOption[];
  selectOptions: ISelectOptions | null
}
const SelectValueBox: React.FC<ISelectValueBoxProps> = (props) => {
  const { options, selectOptions } = props;
  return <CellOptions style={{ flexWrap: 'inherit' }} options={options || []} selectOptions={selectOptions} />;
};

interface IOptionListProps {
  isMulti?: boolean;
  field: ISelectField;
  value: string[] | null;
  onChange?: (value: string[] | null) => void;
}

const OptionList: React.FC<IOptionListProps> = (props) => {
  const { field, value, onChange, isMulti } = props;
  const clickOption = (option: ISelectFieldOption) => {
    const index = (value || []).findIndex(v => option.id === v);
    let _value = value || [];
    if (index > -1) {
      _value = _value.filter(v => option.id !== v);
    } else {
      isMulti ? _value.push(option.id) : _value = [option.id];
    }
    onChange && onChange(_value);
  };

  return (
    <SelectPopupContainer>
      <div>
        {field.property.options.map(option => (
          <OptionItemWrap key={option.id} onClick={() => clickOption(option)}>
            <Box flex={'1'} width={'100%'}>
              <SelectValueBox
                options={field.property.options}
                selectOptions={getSelectOptions([option.id], field.property.options) as ISelectFieldBaseOpenValue[]}
              />
            </Box>
            <Check isChecked={(value || []).includes(option.id)} />
          </OptionItemWrap>
        )
        )}
      </div>
    </SelectPopupContainer>
  );
};

interface ICheckProps {
  isChecked: boolean;
}

const Check: React.FC<ICheckProps> = props => {
  const { isChecked } = props;
  const theme = useTheme();
  if (isChecked) {
    return <CheckOutlined size={16} color={theme.color.deepPurple[500]} />;
  }
  return <></>;
};
