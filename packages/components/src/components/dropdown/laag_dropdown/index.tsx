import React from 'react';
import { useLayer, Arrow, DEFAULT_OPTIONS } from 'react-laag';
import { cloneElement, FunctionComponent, isValidElement, ReactElement, useCallback, useState } from 'react';
import { useProviderTheme } from 'hooks';

type IDropdownTriggerProps = { visible: boolean, toggle?: () => void };
export type IOverLayProps = { toggle: () => void };

export type IDropdownOptions = typeof DEFAULT_OPTIONS;
export type IArrowOptions = Parameters<typeof Arrow>[0];

type IDropdownTriggerFC = (props ?: IDropdownTriggerProps) => ReactElement;
type ITriggerProps = ReactElement | IDropdownTriggerFC;

export const Dropdown: FunctionComponent<{
    clazz?: {
        overlay?: string
    },
    onVisibleChange?: (visible: boolean) => void;
    layerOptions?: IDropdownOptions,
    arrowOptions?: IArrowOptions,
    children: (props: IOverLayProps) => ReactElement,
    trigger: ITriggerProps
}> = ({ trigger, children, onVisibleChange, layerOptions, arrowOptions, clazz }) => {

  const [isOpen, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen(!isOpen);
    onVisibleChange?.(!isOpen);
  }, [isOpen, onVisibleChange]);

  function close() {
    setOpen(false);
  }

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    onOutsideClick: close,
    onDisappear: close,
    overflowContainer: layerOptions?.overflowContainer ?? false,
    auto: layerOptions?.auto ?? true,
    placement: layerOptions?.placement ?? 'bottom-center',
    triggerOffset: layerOptions?.triggerOffset ?? 12,
    containerOffset: layerOptions?.containerOffset ?? 16,
    arrowOffset: layerOptions?.arrowOffset ?? 16
  });

  const triggerEl = isValidElement(trigger) ? trigger :
    trigger({
      visible: isOpen,
      toggle,
    });

  const theme = useProviderTheme();

  return (
    <>
      {
        cloneElement(triggerEl, {
          ...triggerProps,
          onClick: () => setOpen(!isOpen),
        })
      }

      {renderLayer(
        <>
          {isOpen && (
            <div {...layerProps} className={clazz?.overlay}>
              {
                children({ toggle })
              }
              <Arrow {...arrowProps}
                backgroundColor={theme.color.highestBg}
                {...arrowOptions}
              />
            </div>
          )}
        </>
      )}
    </>
  );

};
