import { forwardRef, useImperativeHandle, useRef, memo } from 'react';
import * as React from 'react';
import { Switch, Input } from 'antd';
import style from './style.module.less';

import { stopPropagation } from '../../../utils/dom';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from '../component_display';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
interface ISearchControlProps {
  onValueChange?: (searchValue: string) => void;
  onSwitcherChange?: (checked: boolean) => void;
  onCancelClick?: () => void;
  onFocus?: () => void;
  onkeyDown?: (e: React.KeyboardEvent) => void;
  checked: boolean;
  checkboxText: string;
  value: string;
  placeholder?: string;
  switchVisible?: boolean;
}

const SearchControlBase: React.ForwardRefRenderFunction<{ focus(): void }, ISearchControlProps> = (props, ref) => {
  const {
    value,
    checked,
    onValueChange,
    onSwitcherChange,
    onCancelClick,
    checkboxText,
    placeholder,
    onFocus,
    switchVisible = true,
    onkeyDown,
  } = props;

  const editorRef = useRef<Input>(null);

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
        <LineSearchInput
          value={value}
          placeholder={placeholder}
          onChange={e => onValueChange && onValueChange(e.target.value)}
          onKeyDown={e => onkeyDown && onkeyDown(e)}
          onFocus={onFocus}
          ref={editorRef}
          size={isMobile ? 'large' : 'default'}
          onClear={onCancelClick}
        />
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
