import React, { cloneElement, FunctionComponent, ReactElement, useRef, useState } from 'react';
import {
  FloatingArrow,
  arrow,
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
  Placement,
} from '@floating-ui/react';
import { Typography } from '../../typography';
import { TooltipBase } from '../tooltip';
import { useThemeColors } from '../../../hooks';
import { setIndex } from '../../dropdown';
import { CONST_INITIAL_DROPDOWN_INDEX } from '../../dropdown/float_ui/useFloatUiDropdown';

const CONST_ARROW_HEIGHT = 7;
const CONST_GAP = 2;

interface IProps {
  content: ReactElement | string;
  children: ReactElement;
  placement?: Placement;
  className?: string;
  options?: {
    zIndex?: number;
    offset?: number;
    initialVisible?: boolean;
  };
  arrow?: boolean;
}

const FloatUiTooltip: FunctionComponent<IProps> = ({ content, className, placement = 'bottom', children, options, arrow: hasArrow = true }) => {
  const [isOpen, setIsOpen] = useState(options?.initialVisible ?? false);

  const arrowRef = useRef(null);

  const offsetOrDefault = options?.offset ?? CONST_GAP;
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(hasArrow ? offsetOrDefault + CONST_ARROW_HEIGHT : offsetOrDefault),
      setIndex(options?.zIndex ?? CONST_INITIAL_DROPDOWN_INDEX),
      ...(hasArrow
        ? [
            arrow({
              element: arrowRef,
            }),
          ]
        : []),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
    ],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const theme = useThemeColors();

  return (
    <>
      {cloneElement(children, {
        ref: refs.setReference,
        ...getReferenceProps(),
      })}
      <FloatingPortal>
        {isOpen && (
          <>
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
              <TooltipBase className={className}>
                <Typography variant="body4" color={theme.textReverseDefault}>
                  {content}
                </Typography>
              </TooltipBase>
              {hasArrow && <FloatingArrow ref={arrowRef} context={context} fill={theme.bgReverseDefault} stroke={'null'} />}
            </div>
          </>
        )}
      </FloatingPortal>
    </>
  );
};

export { FloatUiTooltip, TooltipBase };
