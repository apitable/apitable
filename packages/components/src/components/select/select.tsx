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

import { ChevronDownOutlined } from '@apitable/icons';
import { useClickAway, useToggle } from 'ahooks';
import Color from 'color';
import { SelectItem } from 'components/select/select_item';
import { convertChildrenToData } from 'components/select/utils';
import { WrapperTooltip } from 'components/tooltip';
import { IUseListenTriggerInfo, stopPropagation } from 'helper';
import { useProviderTheme } from 'hooks';
import Trigger from 'rc-trigger';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { ListDeprecate } from '../list_deprecate';
import { IListItemProps } from '../list_deprecate/interface';
import { IOption, ISelectProps } from './interface';
import {
  GlobalStyle, hightLightCls, OptionOutside, StyledArrowIcon, StyledListContainer, StyledSelectedContainer, StyledSelectTrigger
} from './styled';
import debounce from 'lodash/debounce';

const _renderValue = (option: IOption) => {
  return option.label;
};

const _Highlighter: any = Highlighter;
const _GlobalStyle: any = GlobalStyle;

/**
 * @deprecated
 * please use DropdownSelect instead ,  rc-trigger is deprecated
 * @param props
 * @constructor
 */
export const Select: FC<React.PropsWithChildren<ISelectProps>> & {
  Option: React.FC<React.PropsWithChildren<Omit<IListItemProps, 'wrapperComponent'> & Pick<IOption, 'value' | 'prefixIcon' | 'suffixIcon'>>>
} = (props) => {
  const {
    placeholder, value, triggerStyle, triggerCls, options: _options, prefixIcon, suffixIcon, dropdownMatchSelectWidth = true,
    openSearch = false, searchPlaceholder, highlightStyle, noDataTip, defaultVisible, hiddenArrow = false, triggerLabel,
    onSelected, hideSelectedOption, dropdownRender, disabled, disabledTip, listStyle, listCls, renderValue = _renderValue,
    children, maxListWidth = 240, popupStyle = {}
  } = props;
  const [isInit, setIsInit] = useState(true);
  const theme = useProviderTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<any>();
  const listContainer = useRef<HTMLDivElement>(null);
  const [visible, { toggle: toggleVisible, set: setVisible }] = useToggle(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = React.useState('');
  const options = useMemo(() => {
    return _options == null ? convertChildrenToData(children) : _options;
  }, [children, _options]);
  const [triggerInfo, setTriggerInfo] = useState<IUseListenTriggerInfo>();
  const OFFSET = [0, 4];
  const selectedOption = options.filter(item => Boolean(item)).find(item => item!.value === value);

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
    setVisible(false);
    // eslint-disable-next-line
  }, [value, toggleVisible, defaultVisible, isInit]);

  useEffect(() => {
    setKeyword('');
  }, [visible, value]);

  useEffect(() => {
    if (triggerRef.current) {
      const size = (triggerRef.current.getRootDomNode() as HTMLElement).getBoundingClientRect();
      setTriggerInfo({ triggerSize: size, triggerOffset: OFFSET, adjust: true });
    }
    // eslint-disable-next-line
  }, [triggerRef]);

  useClickAway(() => {
    setVisible(false);
  }, containerRef, 'click');

  const renderOptionItem = (item: IOption, index: number) => {
    return <OptionOutside
      currentIndex={index}
      id={item.value as string}
      key={`${item.value as string}-${index}`}
      {...item}
    >
      <SelectItem item={item} renderValue={_renderValue} isChecked={value === item.value}>
        {
          !keyword ? null : <_Highlighter
            highlightClassName={hightLightCls.toString()}
            highlightStyle={highlightStyle as any}
            searchWords={[keyword]}
            autoEscape
            textToHighlight={item.label}
          />
        }
      </SelectItem>
    </OptionOutside>;
  };

  const optionsFilter = (item: IOption | null) => {
    if (!item) {
      return false;
    }
    if (hideSelectedOption && item.value === value) {
      return false;
    }
    if (keyword && item.label) {
      // Search supports case, refer to the antd rc select library
      return item.label.toUpperCase().includes(keyword.toUpperCase());
    }
    return true;

  };

  const afterFilterOptions = options!.filter(optionsFilter);

  const renderOptionList = () => {
    return (
      <StyledListContainer
        width={dropdownMatchSelectWidth ? containerRef.current?.clientWidth + 'px' : 'auto'}
        minWidth={!dropdownMatchSelectWidth ? containerRef.current?.clientWidth + 'px' : 'auto'}
        onClick={stopPropagation}
        className={listCls}
        style={{
          ...listStyle,
          maxWidth: dropdownMatchSelectWidth ? '' : maxListWidth
        }}
        ref={listContainer}
      >
        {
          dropdownRender || <ListDeprecate
            onClick={(_e, index) => {
              setVisible(false);
              onSelected && onSelected(afterFilterOptions[index]!, index);
            }}
            searchProps={
              openSearch ? {
                inputRef: inputRef,
                onSearchChange: inputOnChange,
                placeholder: searchPlaceholder,
              } : undefined
            }
            noDataTip={noDataTip}
            triggerInfo={triggerInfo}
            autoHeight
          >
            {
              afterFilterOptions.map((item, index) => {
                return renderOptionItem(item!, index);
              })
            }
          </ListDeprecate>
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
    toggleVisible();
    checked2View();
  };

  return <>
    <_GlobalStyle />
    <Trigger
      // getPopupContainer={() => containerRef.current!}
      popup={renderOptionList}
      destroyPopupOnHide
      popupAlign={
        { points: ['tl', 'bl'], offset: OFFSET, overflow: { adjustX: true, adjustY: true }}
      }
      popupStyle={{
        width: 'max-content',
        position: 'absolute',
        zIndex: 1200, // Same level as antd modal
        ...popupStyle,
      }}
      ref={triggerRef}
      popupVisible={visible}
    >
      <WrapperTooltip wrapper={Boolean(disabledTip && disabled)} tip={disabledTip as string}>
        <StyledSelectTrigger
          onClick={triggerClick}
          style={triggerStyle}
          className={triggerCls}
          tabIndex={-1}
          ref={containerRef}
          disabled={Boolean(disabled)}
          focus={visible}
          data-name='select'
        >
          <StyledSelectedContainer
            className={'ellipsis'}
            {...selectedOption}
            disabled={Boolean(disabled || (selectedOption && selectedOption.disabled))}
            suffixIcon={suffixIcon || selectedOption?.suffixIcon}
            prefixIcon={prefixIcon || selectedOption?.prefixIcon}
          >
            {triggerLabel}
            {!triggerLabel && (
              value != null && selectedOption ? <SelectItem
                item={{
                  ...selectedOption,
                  suffixIcon: suffixIcon || selectedOption.suffixIcon,
                  prefixIcon: prefixIcon || selectedOption.prefixIcon,
                }}
                renderValue={renderValue}
              /> :
                <span className={'placeholder ellipsis'}>
                  {placeholder}
                </span>
            )
            }
          </StyledSelectedContainer>
          {
            !hiddenArrow && <StyledArrowIcon rotated={visible}>
              <ChevronDownOutlined color={disabled ? Color(theme.color.black[500]).alpha(0.5).hsl().string() : theme.color.black[500]} />
            </StyledArrowIcon>
          }
        </StyledSelectTrigger>
      </WrapperTooltip>
    </Trigger>
  </>;
};

const Option = ListDeprecate.Item;

Select.Option = Option;
