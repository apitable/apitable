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

import { Popover } from 'antd';
import { PopoverProps } from 'antd/lib/popover';
import classNames from 'classnames';
import { FC, useState, useRef, useEffect } from 'react';
import * as React from 'react';
import styles from './style.module.less';

interface IPopoverProps extends PopoverProps {
  oneline?: boolean;
  needArrow?: boolean;
  visible?: boolean;
  noCheckDisplay?: boolean;
}

export const Tip: FC<React.PropsWithChildren<IPopoverProps>> = (props) => {
  const { oneline = false, needArrow = false, visible, placement = 'bottom', noCheckDisplay, ...rest } = props;
  const myrefs = useRef<HTMLElement>();
  const isSvg = typeof (props.children as React.ReactElement).type === 'function';
  const [show, setShow] = useState(false);
  const child = React.cloneElement(props.children as React.ReactElement, {
    ref: myrefs,
  });
  useEffect(() => {
    visible != null && setShow(visible);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      return;
    }
    const ref = myrefs.current;
    const checkDisplay = () => {
      if (ref && !noCheckDisplay) {
        if (ref.scrollWidth > ref.clientWidth) {
          setShow(true);
        } else {
          setShow(false);
        }
      }
    };
    if (ref) {
      ref.addEventListener('mouseover', checkDisplay);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('mouseover', checkDisplay);
      }
    };
  }, [visible, noCheckDisplay]);

  const popoverConfig = {
    ...rest,
    overlayClassName: classNames({
      [styles.tipWrapper]: true,
      arrowHidden: !needArrow,
    }),
    placement,
    overlayStyle: { maxWidth: oneline ? 'auto' : '200px' },
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0,
  };
  if (isSvg) {
    const _popoverConfig = typeof props.visible === 'boolean' ? { ...popoverConfig, visible } : popoverConfig;
    return <Popover {..._popoverConfig}>{props.children}</Popover>;
  }

  const curProps = !show ? { visible: false } : {};
  return (
    <Popover {...curProps} {...popoverConfig}>
      {child}
    </Popover>
  );
};
