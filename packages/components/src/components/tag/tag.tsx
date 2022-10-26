import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import Color from 'color';
import { CloseSmallOutlined } from '@vikadata/icons';
import { useProviderTheme } from 'hooks';

export interface ITagProps {
  type?: 'fill' | 'stroke';
  shape?: 'square' | 'round';
  icon?: JSX.Element;
  // background color
  color?: string;
  // text color
  textColor?: string;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  onClose?: (e: React.MouseEvent) => void;
}

const TagBase = styled.div<ITagProps>`
  box-sizing: border-box;
  display: inline-block;
  height: 20px;
  padding: 0 4px;
  font-size: 12px;
  cursor: default;
  ${props => css`
    border-radius: ${props.shape === 'square' ? '2px' : '10px'};
    color: ${props.textColor || props.color};
    ${props.type === 'fill' ? css`
      background: ${Color(props.color).alpha(0.2).toString()};
    ` : css`
      border: 1px solid ${props.color};
    `}
  `}
`;

const Wrapper = styled.div`
  box-sizing: border-box;
  height: 100%;
  line-height: 20px;
  display: flex;
  align-items: center;
`;

const CloseWrapper = styled.div`
  box-sizing: border-box;
  display: inline-block;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

export const Tag: FC<ITagProps> = React.forwardRef((props, ref) => {
  const theme = useProviderTheme();
  const { children, shape = 'square', type = 'fill', color = theme.color.fill0,
    closable = false, closeIcon = <CloseSmallOutlined />, icon, onClose } = props;

  const closeHandler = (e: React.MouseEvent) => {
    onClose && onClose(e);
  };

  return (
    <TagBase
      shape={shape}
      type={type}
      color={color}
    >
      <Wrapper>
        {icon && React.cloneElement(icon, { size: 12 })}
        <Wrapper>{children}</Wrapper>
        {closable && <CloseWrapper onClick={closeHandler}>{closeIcon}</CloseWrapper>}
      </Wrapper>
    </TagBase>
  );
});
