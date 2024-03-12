import { arrow, autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/react';
import { Middleware, MiddlewareState } from '@floating-ui/dom';
import { IDropdownProps } from './index';

const DROP_DOWN_OFFSET = 11;

export const setIndex = (zIndex: number) => {
  return {
    name: 'setIndexPlugin',
    fn(state: MiddlewareState) {
      Object.assign(state.elements.floating.style, {
        zIndex: zIndex,
      });
      return {};
    },
  };
};

export const CONST_INITIAL_DROPDOWN_INDEX = 1202;
export const useFloatUiDropdown: any = (
  options: {
    isOpen: boolean;
    setOpen: (v: boolean) => void;
    arrowRef: React.MutableRefObject<any>;
    middleware?: Array<Middleware>;
  } & IDropdownProps['options']
) => {
  const { isOpen, setOpen } = options;
  const hasArrow = options.arrow ?? true;
  const offsetParameter = hasArrow ? DROP_DOWN_OFFSET : 4;

  const arrowEnabled = options.arrow ?? true;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setOpen,
    placement: options?.placement ?? 'bottom',
    middleware: [
      setIndex(options?.zIndex ?? CONST_INITIAL_DROPDOWN_INDEX),
      ...(options?.autoWidth === true
        ? [
            size({
              apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
                });
              },
            }),
          ]
        : []),
      offset(options?.offset ?? offsetParameter),
      flip({ fallbackAxisSideDirection: 'end' }),
      ...(arrowEnabled
        ? [
            arrow({
              element: options.arrowRef,
            }),
          ]
        : []),
      shift(),
    ].concat(options?.middleware ?? []),
    whileElementsMounted: autoUpdate,
  });

  return { refs, floatingStyles, context };
};
