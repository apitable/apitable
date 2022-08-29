import { Loading } from 'components';
import React from 'react';
import { ButtonBase, IconSpanStyled, TextSpanStyled } from './styled';
import { IButtonProps } from './interface';
import { getCurrentColorIcon } from 'helper';

export const Button = React.forwardRef(({
  children,
  size = 'middle',
  variant = 'fill',
  loading = false,
  suffixIcon,
  prefixIcon,
  color = 'default',
  disabled,
  block,
  htmlType = 'button',
  ...restProps
}: IButtonProps, ref: React.Ref<HTMLButtonElement>) => {

  const PrefixIcon = getCurrentColorIcon(prefixIcon);
  const SuffixIcon = getCurrentColorIcon(suffixIcon);
  return (
    <ButtonBase
      ref={ref}
      size={size}
      btnColor={color}
      variant={variant}
      disabled={loading ? true : disabled}
      block={block}
      type={htmlType}
      {...restProps}
    >
      {loading && (
        <span className="loading">
          <Loading currentColor strokeWidth={1} />
        </span>
      )}
      {prefixIcon && (
        <IconSpanStyled existIcon={Boolean(prefixIcon)} position='prefix'>
          {PrefixIcon}
        </IconSpanStyled>
      )}
      <TextSpanStyled>
        {children}
      </TextSpanStyled>
      {suffixIcon && (
        <IconSpanStyled existIcon={Boolean(suffixIcon)} position='suffix'>
          {SuffixIcon}
        </IconSpanStyled>
      )}
    </ButtonBase>
  );
});
