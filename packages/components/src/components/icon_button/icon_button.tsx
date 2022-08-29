import * as React from 'react';
import { IconButtonStyle } from './styled';
import { IIconButtonProps } from './interface';

export const IconButton: React.FC<IIconButtonProps> = ({
  icon: IconComponent, 
  size = 'small',
  variant = 'default',
  disabled = false,
  active = false,
  component = 'div',
  ...restProps
}) => {
  if (!IconComponent) return null;
  const sizeMap = {
    small: 16,
    large: 24
  };
  const extraProps = component === 'button' ? { type: 'button' } : {};
  return (
    <IconButtonStyle as={component} size={size} variant={variant} disabled={disabled} active={active} {...restProps} {...extraProps}>
      <IconComponent size={sizeMap[size]} currentColor />
    </IconButtonStyle >
  );
};
