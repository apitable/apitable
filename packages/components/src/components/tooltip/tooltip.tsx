import React, { FC, useEffect, useState } from 'react';
import { Arrow, Placement, useHover, useLayer } from 'react-laag';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Typography } from '../typography';
import { useProviderTheme } from 'hooks';
import { applyDefaultTheme } from 'theme';

export interface ITooltipProps {
  /**
   * Tooltip content
   */
  content: string;
  /**
   * Display position
   */
  placement?: Omit<Placement, 'center'>;
  /**
   * Whether show arrow or not
   */
  arrow?: boolean;
  /**
   * Whether visible or not
   */
  visible?: boolean;
  /**
   * Change tooltip color
   */
  color?: string;
  /**
   * Set tooltip z-index
   */
  zIndex?: number;
  /**
   * Trigger type
   */
  trigger?: 'hover' | 'click';
  /**
   * Visible callback
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * Render the parent node, the body is default
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
  const { triggerProps, layerProps, arrowProps, renderLayer } = useLayer({
    isOpen,
    triggerOffset: 12,
    auto: true,
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

  const tooltipBaseProps = { ...layerProps, style: { ...layerProps.style, zIndex, ...style }};

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

