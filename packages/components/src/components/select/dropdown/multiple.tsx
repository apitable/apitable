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
import { CheckOutlined, ChevronDownOutlined } from '@apitable/icons';
import { useToggle } from 'ahooks';
import Color from 'color';
import Highlighter from 'react-highlight-words';
import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import { ListDeprecate } from '../../list_deprecate';
import { IListItemProps } from '../../list_deprecate/interface';
import { IOption, ISelectProps, ISelectValue } from '../interface';
import {
  GlobalStyle,
  hightLightCls,
  OptionOutside,
  StyledArrowIcon,
  StyledListContainer,
  StyledSelectedContainer,
  StyledSelectTrigger,
} from '../styled';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import { ListDropdown, SelectContext } from './list_dropdown';
import { useListItem } from '@floating-ui/react';
import { SelectItem } from '../select_item';
import { convertChildrenToData } from '../utils';
import { IUseListenTriggerInfo, stopPropagation } from '../../../helper';
import { useThemeColors } from '../../../hooks';
import { WrapperTooltip } from '../../tooltip';
import { useCssColors } from '../../../hooks/use_css_colors';

const StyledDropdown = styled(ListDropdown)`
  z-index: 1200;
`;

const OFFSET = [0, 4];

const _renderValue = (option: IOption) => {
  return option.label;
};

const _GlobalStyle: any = GlobalStyle;

const CONST_WIDTH_CHECK_BUTTON = 30;
const MultipleSelectComp: FC<
  React.PropsWithChildren<
    Omit<ISelectProps, 'value'> & {
      value: ISelectValue[];
      onChange?: (value: ISelectValue[]) => void;
    }
  >
> & {
  Option: React.FC<React.PropsWithChildren<Omit<IListItemProps, 'wrapperComponent'> & Pick<IOption, 'value' | 'prefixIcon' | 'suffixIcon'>>>;
} = (props) => {
  const {
    placeholder,
    value,
    triggerStyle,
    onChange,
    triggerCls,
    options: _options,
    dropdownMatchSelectWidth = true,
    openSearch = false,
    searchPlaceholder,
    noDataTip,
    defaultVisible,
    hiddenArrow = false,
    triggerLabel,
    onSelected,
    dropdownRender,
    disabled,
    disabledTip,
    listStyle,
    listCls,
    renderValue = _renderValue,
    children,
    maxListWidth = 240,
  } = props;
  const [isInit, setIsInit] = useState(true);
  const listContainer = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, { toggle: toggleVisible, set: setVisible }] = useToggle(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = React.useState('');
  const options = useMemo(() => {
    return _options == null ? convertChildrenToData(children) : _options;
  }, [children, _options]);
  const selectedOption = options.filter((item) => Boolean(item)).filter((item) => value.includes(item!.value));

  const setKeywordDebounce = debounce(setKeyword, 300);

  const inputOnChange = (_e: React.ChangeEvent, keyword: string) => {
    setKeywordDebounce(keyword);
  };

  useEffect(() => {
    if (defaultVisible != null && isInit) {
      setIsInit(false);
      setVisible(defaultVisible);
      return;
    }
  }, [toggleVisible, defaultVisible, isInit, setVisible]);

  useEffect(() => {
    setKeyword('');
  }, [visible, value]);

  const optionsFilter = (item: IOption | null) => {
    if (!item) {
      return false;
    }
    if (keyword && item.label) {
      // Search supports case, refer to the antd rc select library
      return item.label.toUpperCase().includes(keyword.toUpperCase());
    }
    return true;
  };

  const afterFilterOptions = options!.filter(optionsFilter);

  const triggerRef: React.MutableRefObject<HTMLElement | null> = useRef<HTMLElement>(null);

  const [triggerInfo, setTriggerInfo] = useState<IUseListenTriggerInfo>();

  useEffect(() => {
    if (triggerRef.current) {
      const size = triggerRef.current.getBoundingClientRect();
      setTriggerInfo({ triggerSize: size, triggerOffset: OFFSET, adjust: true });
    }
    // eslint-disable-next-line
  }, [triggerRef.current]);

  const colors = useThemeColors();

  const renderOptionList = () => {
    return (
      <StyledListContainer
        width={dropdownMatchSelectWidth ? (containerRef.current?.clientWidth ?? 0) + CONST_WIDTH_CHECK_BUTTON + 'px' : 'auto'}
        minWidth={!dropdownMatchSelectWidth ? (containerRef.current?.clientWidth ?? 0) + CONST_WIDTH_CHECK_BUTTON + 'px' : 'auto'}
        onClick={stopPropagation}
        className={listCls}
        style={{
          ...listStyle,
          maxWidth: dropdownMatchSelectWidth ? '' : maxListWidth,
        }}
        ref={listContainer}
      >
        {
          // @ts-ignore
          dropdownRender || (
            <ListDeprecate
              onClick={(_e, index) => {
                onSelected && onSelected(afterFilterOptions[index]!, index);
                const item = afterFilterOptions[index];
                if (item?.value) {
                  if (value.includes(item?.value)) {
                    onChange?.(value.filter((v) => v !== item.value));
                  } else {
                    onChange?.(value.concat(item.value));
                  }
                }
              }}
              searchProps={
                openSearch
                  ? {
                    inputRef: inputRef,
                    onSearchChange: inputOnChange,
                    placeholder: searchPlaceholder,
                  }
                  : undefined
              }
              noDataTip={noDataTip}
              triggerInfo={triggerInfo}
              autoHeight
            >
              {afterFilterOptions.filter(Boolean).map((item, index) => {
                return (
                  <OptionItem
                    onClick={() => {
                      onSelected && onSelected(afterFilterOptions[index]!, index);
                      if (item?.value) {
                        if (value.includes(item?.value)) {
                          onChange?.(value.filter((v) => v !== item.value));
                        } else {
                          onChange?.(value.concat(item.value));
                        }
                      }
                    }}
                    item={item as IOption}
                    currentIndex={index}
                    keyword={keyword}
                    value={value}
                  />
                );
              })}
            </ListDeprecate>
          )
        }
      </StyledListContainer>
    );
  };

  const checked2View = () => {
    setTimeout(() => {
      const selectedItemElement = listContainer.current?.querySelector('.isChecked');
      selectedItemElement?.scrollIntoView({ block: 'nearest' });
    }, 20);
  };

  const triggerClick = () => {
    if (disabled) {
      return;
    }
    if (!visible) {
      setTimeout(() => {
        openSearch && inputRef.current && inputRef.current.focus();
      }, 100);
    }
    checked2View();
  };

  return (
    <>
      <_GlobalStyle />
      <StyledDropdown
        onVisibleChange={(visible) => {
          setVisible(visible);
        }}
        setTriggerRef={(element) => {
          triggerRef.current = element;
        }}
        options={{
          arrow: false,
          offset: 4,
          stopPropagation: true,
          // TODO find index
          // selectedIndex: findIndex,
          disabled,
        }}
        trigger={
          <div style={triggerStyle}>
            <WrapperTooltip wrapper={Boolean(disabledTip && disabled)} tip={disabledTip as string}>
              <StyledSelectTrigger
                onClick={() => {
                  triggerClick();
                }}
                // style={triggerStyle}
                className={triggerCls}
                tabIndex={-1}
                ref={containerRef}
                disabled={Boolean(disabled)}
                focus={visible}
                data-name="select"
              >
                <StyledSelectedContainer className={'ellipsis'} disabled={disabled}>
                  {triggerLabel}
                  {!triggerLabel &&
                    (value != null && selectedOption.length > 0 ? (
                      <SelectItem
                        item={{
                          ...selectedOption,
                          value: selectedOption.map((item) => item?.value).join(','),
                          label: selectedOption.map((item) => item?.label).join(','),
                        }}
                        renderValue={renderValue}
                      />
                    ) : (
                      <span className={'placeholder ellipsis'}>{placeholder}</span>
                    ))}
                </StyledSelectedContainer>
                {!hiddenArrow && (
                  <StyledArrowIcon rotated={visible}>
                    <ChevronDownOutlined color={disabled ? Color(colors.textCommonTertiary).alpha(0.5).hsl().string() : colors.textCommonTertiary} />
                  </StyledArrowIcon>
                )}
              </StyledSelectTrigger>
            </WrapperTooltip>
          </div>
        }
      >
        {renderOptionList}
      </StyledDropdown>
    </>
  );
};

const Option = ListDeprecate.Item;

MultipleSelectComp.Option = Option;

export function OptionItem({
  item,
  currentIndex,
  value,
  keyword,
  className,
  onClick,
  iconClassName,
}: {
  item: IOption;
  currentIndex: number;
  iconClassName?: string;
  className?: string;
  value: any[] | any;
  keyword: string;
  onClick: () => void;
}) {
  const { activeIndex, selectedIndex, getItemProps, handleSelect } = React.useContext(SelectContext);

  const { ref, index: aIndex } = useListItem();

  const isActive = activeIndex === aIndex;
  const isSelected = selectedIndex === aIndex;

  const itemProps = getItemProps({
    onClick: () => {
      onClick?.();
      handleSelect(aIndex);
    },
    onKeyDown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        onClick?.();
        handleSelect(aIndex);
      }
    },
  });

  const colors = useCssColors();
  const isChecked = Array.isArray(value) ? value.includes(item?.value) : value === item?.value;
  return (
    <OptionOutside
      currentIndex={currentIndex}
      setRef={ref}
      tabIndex={isActive ? 0 : -1}
      active={isActive}
      selected={isSelected}
      className={className}
      id={item.value as string}
      {...item}
      {...itemProps}
    >
      <SelectItem
        iconClassName={iconClassName}
        item={
          isChecked
            ? {
              suffixIcon: <CheckOutlined color={colors.textBrandDefault} />,
              ...item,
            }
            : item
        }
        renderValue={_renderValue}
        isChecked={isChecked}
      >
        {!keyword ? null : (
          <Highlighter highlightClassName={hightLightCls.toString()} searchWords={[keyword]} autoEscape textToHighlight={item.label} />
        )}
      </SelectItem>
    </OptionOutside>
  );
}

export const MultipleSelect = memo(MultipleSelectComp);
