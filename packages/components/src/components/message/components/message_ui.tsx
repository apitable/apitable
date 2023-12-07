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

import React, { useRef, useEffect } from 'react';
import { applyDefaultTheme } from 'theme';
import styled, { css, keyframes } from 'styled-components';
import { IconMap } from 'helper/icon_helper';
import { FourStatusColorMap } from 'helper/color_helper';
import { IMessageUIProps } from '../interface';
const MessageMoveOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const MessageMoveIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

type IContentWrapper = Pick<IMessageUIProps, 'type'>;

const MessageWrapper = styled.div.attrs(applyDefaultTheme) <Partial<IMessageUIProps>>`
  animation-duration: 0.3s;
  margin: 8px;
  pointer-events: none;
  ${props=>{
    const motionCls = props.motionClassName;
    if(motionCls && motionCls.includes('appear')){
      return css`
         animation-name: ${MessageMoveIn};
      `;
    }
    if(motionCls && motionCls.includes('leave')){
      return css`
        animation-name: ${MessageMoveOut};
      `;
    }
    return;
  }}
`;

const ContentWrapper = styled.div.attrs(applyDefaultTheme) <IContentWrapper>`
  padding: 8px 24px;
  font-size: 14px;
  border-radius: 4px;
  display: inline-block;
  padding: 8px 24px;
  font-size: 14px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  pointer-events: auto;
  ${props => {
    const color = FourStatusColorMap[props.type];
    return css`
      background: ${color};
    `;
  }}
`;
const IconWrapper = styled.span`
  margin-right: 4px;
  display: inline-flex;
`;
const TextWrapper = styled.span.attrs(applyDefaultTheme)`
  ${props => {
    return css`
      color: ${props.theme.color.staticWhite0}
    `;
  }}
`;
export const MessageUI: React.FC<React.PropsWithChildren<IMessageUIProps>> = ({
  content,
  type,
  onDestroy,
  motionClassName,
  duration = 3,
  icon,
}: IMessageUIProps) => {

  const timerRef = useRef<number>();
  const Icon: React.ReactNode = React.useMemo(() => {
    if(typeof icon === 'object' && !icon) return <></>;
    if(icon) return icon;
    const TypeIcon = IconMap[type];
    return <TypeIcon size={24} color={['#fff', FourStatusColorMap[type]]}/>;
  }, [type, icon]);
  const clearTimer = React.useCallback(() => {
    window.clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    clearTimer();
    if (duration !== 0) {
      timerRef.current = window.setTimeout(() => {
        clearTimer();
        onDestroy && onDestroy();
      }, duration * 1000);
    }
    // eslint-disable-next-line
  }, [duration]);

  useEffect(()=>{
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return (
    <MessageWrapper motionClassName={motionClassName}>
      <ContentWrapper type={type}>
        <IconWrapper>{Icon}</IconWrapper>
        {
          typeof content === 'string' ? <TextWrapper>{content}</TextWrapper> : content
        }
      </ContentWrapper>
    </MessageWrapper>
  );
};

