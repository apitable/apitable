import { useLayer, Arrow, DEFAULT_OPTIONS } from 'react-laag';
import { cloneElement, FunctionComponent, ReactElement, useCallback, useState } from 'react';

type DropdownTriggerProps = { visible: boolean, toggle?: () => void };
export type OverLayProps = { toggle: () => void };

export type DropdownOptions = typeof DEFAULT_OPTIONS;

type ArrowOptions = Parameters<typeof Arrow>[0];

export const Dropdown: FunctionComponent<{
    clazz?: {
        overlay?: string
    },
    onVisibleChange?: (visible: boolean) => void;
    layerOptions?: DropdownOptions,
    arrowOptions?: ArrowOptions,
    children: (props: OverLayProps) => ReactElement,
    trigger: (props ?: DropdownTriggerProps) => ReactElement
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
    onOutsideClick: close, // close the menu when the user clicks outside
    onDisappear: close, // close the menu when the menu gets scrolled out of sight
    overflowContainer: layerOptions?.overflowContainer ?? false, // keep the menu positioned inside the container
    auto: layerOptions?.auto ?? true, // automatically find the best placement
    placement: layerOptions?.placement ?? 'bottom-center', // we prefer to place the menu "top-end"
    triggerOffset: layerOptions?.triggerOffset ?? 12, // keep some distance to the trigger
    containerOffset: layerOptions?.containerOffset ?? 16, // give the menu some room to breath relative to the container
    arrowOffset: layerOptions?.arrowOffset ?? 16 // let the arrow have some room to breath also
  });

  const triggerEl = trigger({
    visible: isOpen,
    toggle,
  });
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
                {...arrowOptions}
              />
            </div>
          )}
        </>
      )}
    </>
  );

};
