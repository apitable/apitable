import {
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback,
  useRef,
  useState
} from 'react';
import { useProviderTheme } from 'hooks';
import classNames from 'classnames';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  arrow,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId, FloatingArrow, Placement, FloatingPortal, ReferenceType
} from '@floating-ui/react';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Middleware } from '@floating-ui/dom/src/types';

type IDropdownTriggerProps = { visible: boolean, toggle?: () => void };
export type IOverLayProps = { toggle: () => void };

type IDropdownTriggerFC = (props: IDropdownTriggerProps) => ReactElement;
type ITriggerProps = ReactElement | IDropdownTriggerFC;

interface IDropdownProps {
    clazz?: {
        overlay?: string
    },
    className?: string,
    options ?: {
      disabled?: boolean,
      placement?: Placement;
      arrow?: boolean;
      offset?: number;
    },
    setTriggerRef?: (ref: HTMLElement|null) => void;
    middleware?: Array<Middleware>,
    onVisibleChange?: (visible: boolean) => void;
    children: (props: IOverLayProps) => ReactElement,
    trigger: ITriggerProps
}

export interface IDropdownControl {
    close: () => void;
    open: () => void;
    toggle: (open: Boolean) => void;
}

const DROP_DOWN_OFFSET = 16;
export const Dropdown = forwardRef<IDropdownControl, IDropdownProps>((props, ref) => {
  const { trigger, children, onVisibleChange, options= {}, className, middleware =[], clazz } = props;

  const arrowEnabled = options.arrow?? true;
  const disabled = options.disabled?? false;
  const [isOpen, setOpenValue] = useState(false);
  
  const setOpen = useCallback((isOpenState: boolean) => {
    if(disabled) {
      return;
    }
    setOpenValue(isOpenState);
  }, [setOpenValue, disabled]);

  const toggle = useCallback(() => {
    setOpen(!isOpen);
    onVisibleChange?.(!isOpen);
  }, [isOpen, onVisibleChange, setOpen]);

  const open = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useImperativeHandle(ref, () => ({ open, toggle, close }));

  const theme = useProviderTheme();

  const arrowRef = useRef (null);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setOpen,
    placement: options?.placement ?? 'bottom',
    middleware: [
      offset(options?.offset ?? DROP_DOWN_OFFSET),
      flip({ fallbackAxisSideDirection: 'end' }),
      ...(
        arrowEnabled ? [
          arrow({
            element: arrowRef,
          })
        ]: []
      ),
      shift()
    ].concat(middleware ),
    whileElementsMounted: autoUpdate
  });
  
  const triggerEl = isValidElement(trigger) ? trigger :
    trigger({
      visible: isOpen,
      toggle,
    });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ]);

  const headingId = useId();

  const setRef = (v: ReferenceType|null) => {
    refs.setReference(v);
    props.setTriggerRef?.(v as HTMLElement);
  };
  return (
    <>
      <>
        {
          // @ts-ignore
          cloneElement(triggerEl, { ref: setRef, ...getReferenceProps() })
        }
        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager context={context}>
              <div
                className={classNames(className,clazz?.overlay)}
                ref={refs.setFloating}
                style={floatingStyles}
                aria-labelledby={headingId}
                {...getFloatingProps()}
              >
                {
                  children({ toggle })
                }
                {
                  arrowEnabled && (
                    <FloatingArrow ref={arrowRef} context={context} fill={theme.color.highestBg} strokeWidth={1} stroke={theme.color.borderCommonDefault}/>
                  )
                }
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </>
    </>
  );

});
