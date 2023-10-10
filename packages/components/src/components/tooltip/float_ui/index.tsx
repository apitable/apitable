import React, { cloneElement, FunctionComponent, ReactElement, useRef, useState } from 'react';
import {
  FloatingArrow, arrow,
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  Placement
} from '@floating-ui/react';
import { Typography } from '../../typography';
import { TooltipBase } from '../tooltip';
import { useThemeColors } from '../../../hooks';
import { setIndex } from '../../dropdown';
interface IProps {
    content: ReactElement | string
    children: ReactElement,
    placement?: Placement,
    className?: string,
    options?: {
      zIndex?: number,
      offset?: number,
      initailVisible?: boolean
    },
    arrow?: boolean
}

const FloatUiTooltip: FunctionComponent<IProps> = ({
  content,
  className,
  placement = 'bottom',
  children,
  options,
  arrow: hasArrow = true
}) => {
  const [isOpen, setIsOpen] = useState(options?.initailVisible ?? false);

  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      setIndex(options?.zIndex ?? 1002),
      offset(options?.offset ?? 16),
      ...(
        hasArrow ? (
          [
            arrow({
              element: arrowRef,
            })
          ]
        ) : []
      ),
      flip({
        fallbackAxisSideDirection: 'start'
      }),
      shift()
    ]
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role
  ]);

  const theme = useThemeColors();

  return (
    <>
      {
        cloneElement(children, {
          ref: refs.setReference,
          ...getReferenceProps()
        })
      }
      <FloatingPortal>
        {isOpen && (
          <>
            {
              hasArrow && (
                <div ref={refs.setFloating} style={floatingStyles}>
                  <FloatingArrow ref={arrowRef} context={context} stroke={'none'}
                    fill={theme.bgReverseDefault} />
                </div>
              )
            }
            <TooltipBase
              className={className}
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <Typography variant='body4' color={theme.textReverseDefault}>{content}</Typography>
            </TooltipBase>
          </>
        )}
      </FloatingPortal>
    </>
  );
};

export { FloatUiTooltip };
