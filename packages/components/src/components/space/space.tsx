import React from 'react';
import { ISpaceProps } from './interface';
import { SpaceStyled, SpaceItemStyled, SplitStyled } from './styled';

// Temporarily used for component layout in documents
export const Space: React.FC<ISpaceProps> = props => {
  const { component = 'div', children, split, ...restProps } = props;
  
  return (
    <SpaceStyled as={component} {...restProps}>
      {Array.isArray(children) ? children.map((child, index) => (
        <SpaceItemStyled key={index}>
          {index !== 0 && split && <SplitStyled size={restProps.size} />}
          {child}
        </SpaceItemStyled>
      )) : children}
    </SpaceStyled>
  );
};