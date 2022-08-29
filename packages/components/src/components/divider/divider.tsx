import React from 'react';
import { IDividerProps } from './interface';
import { DividerStyled, DividerChildStyled } from './styled';

export const Divider: React.FC<IDividerProps> = ({
  orientation = 'horizontal', textAlign, dashed, component = 'div', style, className, children, typography = 'body2'
}) => {
  const hasChildren = Boolean(children);
  const dividerProps = { orientation, textAlign, dashed, style, className, hasChildren, typography };
  return (
    <DividerStyled
      as={component}
      {...dividerProps}
    >
      {hasChildren && (
        <DividerChildStyled>{children}</DividerChildStyled>
      )}
    </DividerStyled>
  );
};