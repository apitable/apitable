import React from 'react';
import { IButtonGroupProps } from './interface';
import { ButtonGroupBase } from './styled';

export const ButtonGroup = React.forwardRef(({
  children,
  withSeparate,
  withBorder,
  className,
  ...restProps
}:IButtonGroupProps, ref: React.Ref<HTMLButtonElement>) => {
  return (
    <ButtonGroupBase >
      {children}
    </ButtonGroupBase>
  );
});
