/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import Color from 'color';
import { CloseOutlined } from '@apitable/icons';
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

export const Tag: FC<React.PropsWithChildren<ITagProps>> = React.forwardRef((props, ref) => {
  const theme = useProviderTheme();
  const { children, shape = 'square', type = 'fill', color = theme.color.fill0,
    closable = false, closeIcon = <CloseOutlined />, icon, onClose } = props;

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
