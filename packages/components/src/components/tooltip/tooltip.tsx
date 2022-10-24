import React, { FC, useEffect, useState } from 'react';
import { Arrow, Placement, useHover, useLayer } from 'react-laag';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Typography } from '../typography';
import { useProviderTheme } from 'hooks';
import { applyDefaultTheme } from 'theme';

export interface ITooltipProps {
  /**
   * 要显示的内容
   */
  content: string;
  /**
   * 位置
   */
  placement?: Omit<Placement, 'center'>;
  /**
   * 是否显示小箭头
   */
  arrow?: boolean;
  /**
   * 手动控制显示
   */
  visible?: boolean;
  /**
   * 改变气泡颜色
   */
  color?: string;
  /**
   * 层级定义
   */
  zIndex?: number;
  /**
   * 触发行为
   */
  trigger?: 'hover' | 'click';
  /**
   * 显示隐藏的回调
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * 浮层渲染父节点，默认渲染到body上
   */
  getPopupContainer?: () => HTMLElement;
  style?: React.CSSProperties;
}

const GlobalStyle = createGlobalStyle`
  .tooltip {
    z-index: 1001;
  }
`;

const TooltipBase = styled.div.attrs(applyDefaultTheme)`
  ${props => {
    const color = props.theme.color;
    return css`
      background: ${color.bgReverseDefault};
      border-radius: 4px;
      padding: 8px;
      font-size: 12px;
      line-height: 18px;
      max-width: 211px;
      color: ${props.color || color.textReverseDefault};
    `;
  }}
`;

function isReactText(children: React.ReactNode) {
  return ['string', 'number'].includes(typeof children);
}

export const Tooltip: FC<ITooltipProps> = (
  {
    children,
    content,
    placement = 'top-center',
    color,
    visible,
    arrow = true,
    trigger = 'hover',
    zIndex,
    onVisibleChange,
    getPopupContainer = () => document.body,
    style,
  }
) => {
  const theme = useProviderTheme();
  const [isOver, hoverProps] = useHover();
  const [clickState, setClickState] = useState(false);
  const isOpen = visible != null ? visible : ((trigger === 'hover' && isOver) || (trigger === 'click' && clickState));
  // const isHorizontal = placement.includes('top') || placement.includes('bottom');
  const { triggerProps, layerProps, arrowProps, renderLayer } = useLayer({
    isOpen,
    triggerOffset: 12,
    auto: true,
    // arrowOffset: isHorizontal ? 24 : 13, // FIXME: 这里在 children 宽度和 content 宽度很窄的边界情况下面，会显示错位。先注释掉。
    placement: placement as Placement,
    container: getPopupContainer
  });

  useEffect(() => {
    onVisibleChange && onVisibleChange(isOpen);
  }, [isOpen, onVisibleChange]);

  let triggerEle;
  if (isReactText(children)) {
    triggerEle = (
      <span className='tooltip-text-wrapper' {...triggerProps} {...hoverProps} onClick={() => setClickState(!clickState)}>
        {children}
      </span>
    );
  } else {
    triggerEle = React.cloneElement(children as any, {
      ...triggerProps,
      ...hoverProps,
      onClick: () => setClickState(!clickState),
    });
  }

  const tooltipBaseProps = { ...layerProps, style: { ...layerProps.style, zIndex, ...style } };

  return (
    <>
      {triggerEle}
      {isOpen &&
        renderLayer(
          <TooltipBase className='tooltip' color={color || theme.color.textReverseDefault} {...tooltipBaseProps}>
            <Typography variant='body4' color={color || theme.color.textReverseDefault}>{content}</Typography>
            {arrow &&
              <Arrow
                {...arrowProps}
                backgroundColor={style?.backgroundColor || theme.color.bgReverseDefault}
                size={8}
              />
            }
          </TooltipBase>
        )}
      <GlobalStyle />
    </>
  );
};

