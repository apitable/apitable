import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import RcTrigger from 'rc-trigger';
import cx from 'classnames';
import { ChevronDownOutlined } from '@vikadata/icons';

import CheckOutlined from '@ant-design/icons/CheckOutlined';
import { useClickAway } from 'ahooks';
import { useThemeColors } from '@vikadata/components';

import styles from './style.module.less';
import { getElementDataset } from 'pc/utils';

type TSelectValue = string;

interface IOption {
  value: TSelectValue;
  label: React.ReactNode;
  option?: React.ReactNode; // 用于在候选面板中渲染
}

interface ISelectProps {
  onChange: (value: TSelectValue) => void;
  options: IOption[];
  value?: TSelectValue;
  disabled?: boolean;
  className?: string;
  activeClassName?: string;
  width?: number;
  zIndex?: number;
  placeholder?: React.ReactNode;
  trigger?: 'click' | 'hover' | 'mousedown';
  triggerArrowVisible?: boolean;
  selectedSignVisible?: boolean;
  offset?: { x: number, y: number };
  destroyPopupOnHide?: boolean;
  customRenderTrigger?: (value: TSelectValue) => React.ReactElement;
  onVisibleChange?: (visible: boolean) => void;
}

const DEFAULT_PLACEHOLDER = '请选择...';
const UNKNOWN_VALUE = '未知';

export const Select = ({
  onChange,
  disabled,
  options,
  trigger = 'mousedown',
  value: propsValue,
  className,
  activeClassName,
  placeholder = DEFAULT_PLACEHOLDER,
  width: panelWidth = 200,
  customRenderTrigger,
  triggerArrowVisible = true,
  destroyPopupOnHide = true,
  selectedSignVisible = true,
  zIndex = 1050,
  offset = { x: 0, y: 10 },
  onVisibleChange
}: ISelectProps) => {
  const colors = useThemeColors();
  const [value, setValue] = useState(propsValue);
  const [visible, setVisible] = useState(false);

  const wrapRef = useRef<HTMLUListElement>(null);

  const triggerRef = useRef(null);

  useClickAway(() => { setVisible(false); }, [triggerRef, wrapRef]);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleTriggerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setVisible(!visible);
  };

  const handleItemMouseDown = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    setVisible(false);
    if (disabled || !target) {
      return;
    }
    const nextValue = getElementDataset(target, 'value');
    if (nextValue != null) {
      if (onChangeRef.current) {
        onChangeRef.current(nextValue);
      } else {
        setValue(nextValue);
      }
    }
  }, [disabled, setValue]);

  useEffect(() => {
    if (propsValue !== value) {
      setValue(propsValue);
    }
  }, [propsValue, value]);

  const renderedTrigger = useMemo(() => {
    if (value == null) {
      return <span className={styles.placeholder}>{placeholder}</span>;
    }
    const selected = options.find((item) => item.value === value);
    if (selected) {
      let child = selected.label ?? selected.value;
      if (customRenderTrigger) {
        child = customRenderTrigger(selected.value);
      }
      return <span className={styles.triggerValue} data-with-arrow={triggerArrowVisible}>{child}</span>;
    }
    return value || UNKNOWN_VALUE;
  }, [value, placeholder, options, customRenderTrigger, triggerArrowVisible]);

  const TriggerElement = (
    <div
      className={cx(styles.trigger, className, visible && activeClassName)}
      onMouseDownCapture={handleTriggerMouseDown}
      data-disabled={disabled}
      ref={triggerRef}
    >
      {renderedTrigger}
      { triggerArrowVisible && <ChevronDownOutlined
        color={colors.thirdLevelText} className={cx(styles.triggerIcon, { [styles.triggerIconOpen]: visible })} />
      }
    </div>
  );

  const SelectPanel = (
    <ul className={styles.selectPanel} data-hide={!visible} ref={wrapRef}>
      {
        options.map((item) => <li
          key={item.value}
          data-value={item.value}
          data-active={item.value === value}
          onMouseDownCapture={handleItemMouseDown}>
          {item.option ?? item.label}
          {item.value === value && selectedSignVisible && <CheckOutlined />}
        </li>)
      }
    </ul>
  );

  useEffect(() => {
    if (!wrapRef.current || !visible) {
      return;
    }
    const ul = wrapRef.current;
    const childList = Array.from(ul.childNodes) as HTMLLIElement[];
    if (!childList.length) {
      return;
    }
    const selected = childList.find((childEle) => getElementDataset(childEle, 'active') === 'true');
    if (selected) {
      const offsetTop = selected.offsetTop;
      const wrapHeight = ul.offsetHeight;
      const wrapScrollTop = ul.scrollTop;
      if (offsetTop > (wrapHeight + wrapScrollTop)) {
        selected.scrollIntoView();
      }
    }
  });

  const handleVisibleChange = useCallback((next) => {
    setVisible(disabled ? false : next);
    onVisibleChange?.(next);
  }, [disabled, onVisibleChange]);

  return <RcTrigger
    popup={SelectPanel}
    action={[trigger]}
    destroyPopupOnHide={destroyPopupOnHide}
    popupAlign={{
      points: ['tl', 'bl'],
      offset: [offset.x, offset.y],
      overflow: { adjustX: true, adjustY: true },
    }}
    popupStyle={{ width: panelWidth || '100%' }}
    popupVisible={disabled ? false : visible}
    onPopupVisibleChange={handleVisibleChange}
    zIndex={zIndex}
  >
    {TriggerElement}
  </RcTrigger>;
};

