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

import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Arrow, Placement, useHover, useLayer } from 'react-laag';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Typography } from '../typography';
import { useProviderTheme } from 'hooks';
import { applyDefaultTheme } from 'theme';

export interface ITooltipProps {
  /**
   * Tooltip content
   */
  content: string | ReactElement;
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

const CONST_TOOLTIP_INDEX = 1201;

const GlobalStyle: any = createGlobalStyle`
  .tooltip {
    z-index: ${CONST_TOOLTIP_INDEX};
  }
`;

export const TooltipBase = styled.div.attrs(applyDefaultTheme)`
  ${(props) => {
    const color = props.theme.color;
    return css`
      z-index: ${CONST_TOOLTIP_INDEX};
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

export const Tooltip: FC<React.PropsWithChildren<ITooltipProps>> = ({
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
}) => {
  const theme = useProviderTheme();
  const [isOver, hoverProps] = useHover();
  const [clickState, setClickState] = useState(false);
  const isOpen = visible != null ? visible : (trigger === 'hover' && isOver) || (trigger === 'click' && clickState);
  const { triggerProps, layerProps, arrowProps, renderLayer } = useLayer({
    isOpen,
    triggerOffset: 12,
    auto: true,
    placement: placement as Placement,
    container: getPopupContainer,
  });

  useEffect(() => {
    onVisibleChange && onVisibleChange(isOpen);
  }, [isOpen, onVisibleChange]);

  let triggerEle;
  if (isReactText(children)) {
    triggerEle = (
      <span className="tooltip-text-wrapper" {...triggerProps} {...hoverProps} onClick={() => setClickState(!clickState)}>
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
          <TooltipBase className="tooltip" color={color || theme.color.textReverseDefault} {...tooltipBaseProps}>
            <Typography variant="body4" color={color || theme.color.textReverseDefault}>
              {content}
            </Typography>
            {arrow && <Arrow {...arrowProps} backgroundColor={style?.backgroundColor || theme.color.bgReverseDefault} size={8} />}
          </TooltipBase>
        )}
      <GlobalStyle />
    </>
  );
};
