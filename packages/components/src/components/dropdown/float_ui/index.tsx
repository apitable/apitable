import {
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback, useEffect,
  useRef,
  useState
} from 'react';
import { useProviderTheme } from 'hooks';
import classNames from 'classnames';
import {
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId, FloatingArrow, Placement, FloatingPortal, ReferenceType
} from '@floating-ui/react';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useFloatUiDropdown } from './useFloatUiDropdown';
export { setIndex } from './useFloatUiDropdown';
import { Middleware } from '@floating-ui/dom';

type IDropdownTriggerProps = { visible: boolean, toggle?: () => void };
export type IOverLayProps = { toggle: () => void };

type IDropdownTriggerFC = (props: IDropdownTriggerProps) => ReactElement;
type ITriggerProps = ReactElement | IDropdownTriggerFC;

export interface IDropdownProps {
    clazz?: {
        overlay?: string
    },
    className?: string,
    options ?: {
      zIndex?: number
      disabled?: boolean,
      placement?: Placement;
      arrow?: boolean;
      offset?: number;
      autoWidth?: boolean;
      selectedIndex?:number;
      stopPropagation?: boolean;
      visible?: boolean;
      disableClick?: boolean;
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
    resetIndex ?:() => void;
}

const CONST_INITIAL_DROPDOWN_INDEX = 1202;
export const Dropdown = forwardRef<IDropdownControl, IDropdownProps>((props, ref) => {
  const { trigger, children, onVisibleChange, options= {
    zIndex: CONST_INITIAL_DROPDOWN_INDEX
  }, className, middleware =[], clazz } = props;

  const arrowEnabled = options.arrow?? true;
  const disabled = options.disabled?? false;
  const [isOpen, setOpenValue] = useState(false);

  useEffect(() => {
    if(options?.visible != null) {
      setOpenValue(options.visible);
    }
  }, [options?.visible]);

  const setOpen = useCallback((isOpenState: boolean) => {
    if(disabled) {
      return;
    }
    onVisibleChange?.(isOpenState);
    setOpenValue(isOpenState);
  }, [disabled, onVisibleChange]);

  const toggle = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);

  const open = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useImperativeHandle(ref, () => ({ open, toggle, close }));

  const theme = useProviderTheme();

  const arrowRef = useRef (null);
  const { refs, floatingStyles, context } =useFloatUiDropdown({
    ...options,
    middleware,
    setOpen,
    isOpen,
    arrowRef
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
    ...(options?.disableClick === true ? []: [click]),
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
          cloneElement(triggerEl, { ref: setRef, ...getReferenceProps(options?.stopPropagation ? {
            onClick: e => e.stopPropagation()
          }: {}) })
        }
        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager context={context}>
              <div
                className={classNames(className, clazz?.overlay)}
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
