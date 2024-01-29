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

import type { InputRef } from 'antd';
import * as React from 'react';
import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { Switch } from '@apitable/components';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from '../../../utils/dom';
import { ScreenSize } from '../component_display';
import style from './style.module.less';

interface ISearchControlProps {
  onValueChange?: (searchValue: string) => void;
  onSwitcherChange?: (checked: boolean) => void;
  onCancelClick?: () => void;
  onFocus?: () => void;
  onkeyDown?: (e: React.KeyboardEvent) => void;
  checked?: boolean;
  checkboxText?: string;
  value: string;
  placeholder?: string;
  switchVisible?: boolean;
}

const SearchControlBase: React.ForwardRefRenderFunction<{ focus(): void }, ISearchControlProps> = (props, ref) => {
  const {
    value,
    checked = false,
    onValueChange,
    onSwitcherChange,
    onCancelClick,
    checkboxText,
    placeholder,
    onFocus,
    switchVisible = true,
    onkeyDown,
  } = props;

  const editorRef = useRef<InputRef>(null);

  const { embedId, dashboardId } = useAppSelector((state) => state.pageParams);

  const hideSearchAndSwitch = Boolean(embedId && dashboardId);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useImperativeHandle(ref, () => ({
    focus: () => {
      focus();
    },
  }));

  const focus = () => {
    editorRef.current && editorRef.current.focus();
  };

  return (
    <div className={style.searchContainer}>
      <div className={style.inputContainer} onClick={stopPropagation}>
        {!hideSearchAndSwitch && (
          <LineSearchInput
            value={value}
            placeholder={placeholder}
            onChange={(e) => onValueChange && onValueChange(e.target.value)}
            onKeyDown={(e) => onkeyDown && onkeyDown(e)}
            onFocus={onFocus}
            ref={editorRef}
            size={isMobile ? 'large' : 'default'}
            onClear={onCancelClick}
          />
        )}
      </div>
      {switchVisible && (
        <div className={style.searchOption}>
          {checkboxText}
          <Switch size={isMobile ? 'default' : 'small'} checked={checked} onChange={onSwitcherChange} />
        </div>
      )}
    </div>
  );
};

export const SearchControl = memo(forwardRef(SearchControlBase));
