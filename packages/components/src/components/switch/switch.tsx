import React from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import KeyCode from 'rc-util/lib/KeyCode';
import { ISwitchProps } from './interface';
import { SwitchInnerBase, SwitchBase, SwitchBeforeBase } from './styled';
import { Loading } from 'components';
export const Switch = React.forwardRef<HTMLButtonElement, ISwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked,
      disabled,
      loadingIcon,
      loading,
      checkedChildren,
      unCheckedChildren,
      onClick,
      onChange,
      onKeyDown,
      size = 'default',
      ...restProps
    },
    ref,
  ) => {
    const [innerChecked, setInnerChecked] = useMergedState<boolean>(false, {
      value: checked,
      defaultValue: defaultChecked,
    });

    function triggerChange(
      newChecked: boolean,
      event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
    ) {
      let mergedChecked = innerChecked;
      if (!disabled) {
        mergedChecked = newChecked;
        setInnerChecked(mergedChecked);
        onChange && onChange(mergedChecked, event);
      }

      return mergedChecked;
    }

    function onInternalKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      if (e.keyCode === KeyCode.LEFT) {
        triggerChange(false, e);
      } else if (e.keyCode === KeyCode.RIGHT) {
        triggerChange(true, e);
      }
      onKeyDown && onKeyDown(e);
    }

    function onInternalClick(e: React.MouseEvent<HTMLButtonElement>) {
      const ret = triggerChange(!innerChecked, e);
      onClick && onClick(ret, e);
    }

    return (
      <SwitchBase
        {...restProps}
        type="button"
        role="switch"
        ref={ref}
        onKeyDown={onInternalKeyDown}
        onClick={(e: any) => onInternalClick(e)}
        checked={innerChecked}
        disabled={disabled || loading}
        size={size}
      >
        <SwitchBeforeBase size={size} checked={innerChecked}>
          { loading ? (loadingIcon || <Loading/>) : null}
        </SwitchBeforeBase>
        <SwitchInnerBase checked={innerChecked}>
          {innerChecked ? checkedChildren : unCheckedChildren}
        </SwitchInnerBase>
      </SwitchBase>
    );
  },
);