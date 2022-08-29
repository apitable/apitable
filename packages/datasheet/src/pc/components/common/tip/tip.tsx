import { FC, useState } from 'react';
import * as React from 'react';
import { Popover } from 'antd';
import styles from './style.module.less';
import { PopoverProps } from 'antd/lib/popover';
import { useRef } from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';

// oneline: 当气泡内的内容不需要换行时传入此参数，默认为false
// needArrow: 是否显示气泡框的箭头，默认为false
// visible: 手动控制是否显示
interface IPopoverProps extends PopoverProps {
  oneline?: boolean;
  needArrow?: boolean;
  visible?: boolean;
  noCheckDisplay?: boolean; // 主动传入这个参数，取消对宽度的检查。
}

export const Tip: FC<IPopoverProps> = props => {
  const { oneline = false, needArrow = false, visible,
    placement = 'bottom', noCheckDisplay, ...rest } = props;
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
    return (
      <Popover
        {..._popoverConfig}
      >
        {props.children}
      </Popover >
    );
  }

  const curProps = !show ? { visible: false } : {};
  return (
    <Popover
      {...curProps}
      {...popoverConfig}
    >
      {child}
    </Popover >
  );
};
