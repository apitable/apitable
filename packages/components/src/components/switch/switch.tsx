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