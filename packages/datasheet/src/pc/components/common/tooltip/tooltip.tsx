import { Tooltip as AntdTooltip } from 'antd';
import { TooltipProps as AntdTooltipProps } from 'antd/es/tooltip';
import { isTouchDevice } from 'pc/utils';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './style.module.less';

export interface ITooltipProps {
  showTipAnyway?: boolean;
  textEllipsis?: boolean;
  overflowWidth?: number;
  offset?: number[];
  rowsNumber?: number;
}

/**
 * 默认情况：pc上显示，触摸设备不显示
 * @param textEllipsis： 与默认情况相似，主要针对文本，当有部分文本被隐藏时显示，否则不显示
 * @param showTipAnyway： 不管什么设备上都显示
 */
export const Tooltip: FC<ITooltipProps & AntdTooltipProps> = ({
  showTipAnyway = false,
  textEllipsis = false,
  offset = [0, -3],
  overflowWidth,
  rowsNumber,
  ...props
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const myrefs = useRef<HTMLElement>();

  useEffect(() => {
    if (!myrefs.current || !textEllipsis) {
      return;
    }
    if (overflowWidth) {
      setShowPopover(myrefs.current.clientWidth > overflowWidth);
      return;
    }
    setShowPopover(myrefs.current.scrollWidth > myrefs.current.clientWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myrefs.current, overflowWidth]);

  if (
    showTipAnyway ||
    (textEllipsis && showPopover && !isTouchDevice()) ||
    (!showTipAnyway && !textEllipsis && !isTouchDevice())
  ) {
    return <AntdTooltip
      align={{ offset }}
      trigger='hover'
      overlayClassName={rowsNumber ? styles.controlRowsNum : ''}
      ref={myrefs}
      {...props}
    >
      {props.children}
    </AntdTooltip>;
  }
  return <>{props.children}</> || null;
};
