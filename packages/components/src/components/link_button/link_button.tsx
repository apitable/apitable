import React from 'react';
import { ILinkButtonProps } from './interface';
import { StyledLinkButton, LinkButtonText } from './styled';

export const LinkButton = ({
  underline = true,
  color,
  prefixIcon,
  suffixIcon,
  as,
  children,
  component = 'a',
  ...restProps
}: ILinkButtonProps) => {

  const extraProps = component === 'button' ? { type: 'button' } : {};

  return <StyledLinkButton
    as={component}
    color={color}
    {...extraProps}
    {...restProps}
  >
    {prefixIcon}
    <LinkButtonText
      underline={underline}
      prefixIcon={prefixIcon}
      suffixIcon={suffixIcon}
    >
      {children}
    </LinkButtonText>
    {suffixIcon}
  </StyledLinkButton>;
};
