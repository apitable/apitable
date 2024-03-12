import { cloneElement, isValidElement, useCallback, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId,
  FloatingArrow,
  FloatingPortal,
  ReferenceType,
  useListNavigation,
  FloatingList,
} from '@floating-ui/react';
import React, { forwardRef, useImperativeHandle } from 'react';
import { useProviderTheme } from '../../../hooks';
import { useFloatUiDropdown } from '../../dropdown/float_ui/useFloatUiDropdown';
import { IDropdownProps } from '../../dropdown';

export interface IDropdownControl {
  close: () => void;
  open: () => void;
  toggle: (open: Boolean) => void;
  resetIndex: () => void;
}

const CONST_INITIAL_DROPDOWN_INDEX = 1202;

interface SelectContextValue {
  activeIndex: number | null;
  selectedIndex: number | null;
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  handleSelect: (index: number | null) => void;
}

export const SelectContext = React.createContext<SelectContextValue>({} as SelectContextValue);

export const ListDropdown = forwardRef<IDropdownControl, IDropdownProps>((props, ref) => {
  const {
    trigger,
    children,
    onVisibleChange,
    options = {
      zIndex: CONST_INITIAL_DROPDOWN_INDEX,
    },
    className,
    middleware = [],
    clazz,
  } = props;

  const arrowEnabled = options.arrow ?? true;
  const disabled = options.disabled ?? false;
  const [isOpen, setOpenValue] = useState(false);

  const setOpen = useCallback(
    (isOpenState: boolean) => {
      if (disabled) {
        return;
      }
      setOpenValue(isOpenState);
    },
    [setOpenValue, disabled]
  );

  const toggle = useCallback(() => {
    setOpen(!isOpen);
    onVisibleChange?.(!isOpen);
  }, [isOpen, onVisibleChange, setOpen]);

  const open = useCallback(() => {
    setOpen(true);
    onVisibleChange?.(true);
  }, [onVisibleChange, setOpen]);

  const close = useCallback(() => {
    setOpen(false);
    onVisibleChange?.(false);
  }, [onVisibleChange, setOpen]);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(options?.selectedIndex ?? null);
  const resetIndex = useCallback(() => {
    setSelectedIndex(options?.selectedIndex ?? null);
  }, [setSelectedIndex, options?.selectedIndex]);

  const theme = useProviderTheme();

  const arrowRef = useRef(null);

  const triggerEl = isValidElement(trigger)
    ? trigger
    : trigger({
        visible: isOpen,
        toggle,
      });

  useImperativeHandle(ref, () => ({ open, toggle, close, resetIndex }));

  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const { refs, floatingStyles, context } = useFloatUiDropdown({
    ...options,
    middleware,
    setOpen,
    isOpen,
    arrowRef,
  });

  const handleSelect = React.useCallback((index: number | null) => {
    setSelectedIndex(index);
    // setOpen(false);
  }, []);

  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    scrollItemIntoView: true,
    onNavigate: setActiveIndex,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([listNav, click, dismiss, role]);

  const selectContext = React.useMemo(
    () => ({
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect,
    }),
    [activeIndex, selectedIndex, getItemProps, handleSelect]
  );

  const headingId = useId();

  const setRef = (v: ReferenceType | null) => {
    refs.setReference(v);
    props.setTriggerRef?.(v as HTMLElement);
  };

  return (
    <>
      {
        // @ts-ignore
        cloneElement(triggerEl, { ref: setRef, ...getReferenceProps() })
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
              <SelectContext.Provider value={selectContext}>
                <FloatingList elementsRef={elementsRef}>{children({ toggle })}</FloatingList>
              </SelectContext.Provider>
              {arrowEnabled && (
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  fill={theme.color.highestBg}
                  strokeWidth={1}
                  stroke={theme.color.borderCommonDefault}
                />
              )}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
});
