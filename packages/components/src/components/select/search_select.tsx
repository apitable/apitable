import debounce from 'lodash/debounce';
import React, {forwardRef, FunctionComponent, ReactElement, useRef} from 'react';
import styled, { css } from 'styled-components';
import {IDropdownControl, ListDropdown} from './dropdown/list_dropdown';
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

interface ISearchSelectProps {
    list: IOption[];
    disabled?: boolean;
    value?: string;
    children: ReactElement
    onChange?: (value: IOption) => void;
    clazz?: {
        item?: string
        icon?: string
    }
    options?: {
        searchEnabled?: boolean;
        noDataText?: string;
        minWidth?: string;
        placeholder?: string
    }
}

export const SearchSelect: FunctionComponent<ISearchSelectProps>= forwardRef<IDropdownControl, ISearchSelectProps>(({ list, clazz, disabled = false, onChange, options, children, value }, ref) => {

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
      ref={ref}
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
                options?.searchEnabled == true ? {
                  inputRef: inputRef,
                  onSearchChange: inputOnChange,
                  placeholder: options?.placeholder,
                }: undefined
              }
              autoHeight
            >
              {
                afterFilterOptions.map((item, index) => (
                  <OptionItem
                    className={clazz?.item}
                    iconClassName={clazz?.icon}
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
});

