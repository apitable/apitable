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
      color: ${props.theme.palette.common.white}
    `;
  }}
`;
export const MessageUI: React.FC<IMessageUIProps> = ({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <TextWrapper>{content}</TextWrapper>
      </ContentWrapper>
    </MessageWrapper>
  );
};

