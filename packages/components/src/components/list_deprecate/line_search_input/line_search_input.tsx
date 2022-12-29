import React from 'react';
import { SearchOutlined } from '@apitable/icons';
import { ILineSearchInputProps } from './interface';
import { PrefixIcon, StyledSearchInputContainer, SuffixIcon } from './styled';
import { useKeyPress } from 'ahooks';
import { useProviderTheme } from 'hooks';

export const LineSearchInputBase: React.ForwardRefRenderFunction<{}, ILineSearchInputProps> = (props, ref) => {
  const { onChange, value, onPressEnter, className, onFocus, size = 'default', placeholder, style, clearClick, showClearIcon } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const theme = useProviderTheme();

  React.useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current!.focus();
      },
    };
  });

  useKeyPress('Enter', (e) => {
    onPressEnter && onPressEnter(e);
  }, { target: inputRef });

  const onCancelClick = () => {
    if (!showClearIcon) {
      return;
    }
    if (clearClick && typeof clearClick === 'function') {
      return clearClick();
    }
    inputRef.current!.value = '';
  };

  return <StyledSearchInputContainer
    className={className}
    style={style}
    size={size}
  >
    <PrefixIcon>
      <SearchOutlined color={theme.color.black[300]} />
    </PrefixIcon>
    <input
      type="text"
      ref={inputRef}
      onFocus={onFocus}
      onChange={onChange}
      value={value}
      placeholder={placeholder || 'please input'}
      size={1}
    />
    <SuffixIcon onClick={onCancelClick}>
      {/* {Boolean(value && showClearIcon) && <CloseIcon />} */}
    </SuffixIcon>
  </StyledSearchInputContainer>;
};

export const LineSearchInput = React.forwardRef(LineSearchInputBase);
