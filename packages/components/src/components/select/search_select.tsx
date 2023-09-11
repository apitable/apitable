import debounce from 'lodash/debounce';
import React, { FunctionComponent, ReactElement, useRef } from 'react';
import styled, { css } from 'styled-components';
import { ListDropdown } from './dropdown/list_dropdown';
import { ListDeprecate } from '../list_deprecate';
import { OptionItem } from './dropdown';
import { IOption } from './interface';
import { applyDefaultTheme } from '../../theme';

const StyledListContainer = styled.div.attrs(applyDefaultTheme) <{ width: string; minWidth: string }>`
  width: ${(props) => props.width};
  min-width: ${(props) => props.minWidth};
  padding: 4px 0;
  ${props => css`
    background-color: ${props.theme.color.highestBg};
    box-shadow: ${props.theme.color.shadowCommonHighest};
  `}
  border-radius: 4px;
`;

export const optionsFilter = (item: IOption | null, keyword: string) => {
  if (!item) {
    return false;
  }
  if (keyword && item.label) {
    return item.label.toUpperCase().includes(keyword.toUpperCase());
  }
  return true;
};

export const SearchSelect: FunctionComponent<{
    list: IOption[];
    disabled?: boolean;
    value?: string;
    children: ReactElement
    onChange?: (value: IOption) => void;
    options?: {
        noDataText?: string;
        minWidth?: string;
        placeholder?: string
    }
}> = ({ list, disabled = false,  onChange, options, children, value }) => {

  const [keyword, setKeyword] = React.useState('');

  const setKeywordDebounce = debounce(setKeyword, 300);

  const afterFilterOptions = list.filter(item => optionsFilter(item, keyword));

  const findIndex= afterFilterOptions.findIndex(item => item?.value === value);

  const inputOnChange = (_e: React.ChangeEvent, keyword: string) => {
    setKeywordDebounce(keyword);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <ListDropdown
      onVisibleChange={() => {
        setKeyword('');
      }}
      options={{
        arrow: false,
        selectedIndex: findIndex,
        disabled:disabled,
        offset: 4,
        zIndex: 1200,
        autoWidth: true,
      }}
      trigger={
        children
      }
    >
      {
        ({ toggle })=> (
          <StyledListContainer
            width={'auto'}
            minWidth={options?.minWidth ?? 'auto'}
          >
            <ListDeprecate
              noDataTip={options?.noDataText}
              onClick={(_e, index) => {

                toggle();
                onChange?.(afterFilterOptions[index]!);
              }}
              searchProps={
                {
                  inputRef: inputRef,
                  onSearchChange: inputOnChange,
                  placeholder: options?.placeholder,
                }
              }
              autoHeight
            >
              {
                afterFilterOptions.map((item, index) => (
                  <OptionItem
                    key={item.value}
                    onClick={() => {
                      toggle();
                      onChange?.(item);
                    }} item={item} currentIndex={index} keyword={keyword} value={value}/>)
                )
              }
            </ListDeprecate>
          </StyledListContainer>
        )
      }
    </ListDropdown>
  );
};

