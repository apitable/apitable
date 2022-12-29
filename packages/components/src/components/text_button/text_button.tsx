import { getCurrentColorIcon } from 'helper';
import React from 'react';
import { ITextButtonProps } from './interface';
import { IconSpanStyled, TextButtonBase } from './styled';

const _TextButton = ({
  children,
  size = 'middle',
  color = 'default',
  prefixIcon,
  suffixIcon,
  disabled,
  block,
  ...restProps

}: ITextButtonProps, ref: React.Ref<HTMLButtonElement>) => {
  const baseProps = {
    btnColor: color,
    size,
    disabled,
    block,
    ...restProps,
  };
  const PrefixIcon = getCurrentColorIcon(prefixIcon);
  const SuffixIcon = getCurrentColorIcon(suffixIcon);
  return (
    <>
      <TextButtonBase {...baseProps} ref={ref}>
        {Boolean(prefixIcon) && <IconSpanStyled existIcon={Boolean(prefixIcon)} position='prefix'>
          {PrefixIcon}
        </IconSpanStyled>}
        {children}
        {Boolean(suffixIcon) && <IconSpanStyled existIcon={Boolean(suffixIcon)} position='suffix'>
          {SuffixIcon}
        </IconSpanStyled>}
      </TextButtonBase>
    </>
  );
};

export const TextButton = React.forwardRef(_TextButton);