import { CSSProperties, FC, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import { useClickAway } from 'ahooks';

import { Typography } from '@vikadata/components';
import { SelectOutlined } from '@vikadata/icons';

import { calcSize } from './utils';
import { IDropdown, IDropdownItem } from './interface';

import styles from './style.module.less';

export const Dropdown: FC<IDropdown> = ({
  mode = 'common',
  className,
  data,
  value,
  visible,
  selectedMode = 'icon',
  divide,
  searchable,
  footer,
  labelInDangerHTML,
  triggerRef,
  autoWidth,
  hoverElement,
  renderItem,
  onClick,
  onClose
}) => {
  const handleRef = useRef<number>();
  const popupRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [innerVisible, setInnerVisible] = useState(false);
  const [realVisible, setRealVisible] = useState(false);
  const [globalStyle, setGlobalStyle] = useState<CSSProperties>();
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>();

  const handleItemClick = (item: IDropdownItem, e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(item, e);
    }
  };

  // 控制显示
  useLayoutEffect(() => {
    clearTimeout(handleRef.current);
    if (visible) {
      setRealVisible(true);
      handleRef.current = window.setTimeout(() => {
        setInnerVisible(true);
      }, 100);
      return;
    }
    setInnerVisible(false);
    handleRef.current = window.setTimeout(() => {
      setRealVisible(false);
    }, 200);
  }, [visible]);

  // 计算位置，尺寸
  useEffect(() => {
    if (innerVisible && triggerRef?.current && scrollRef.current && (mode === 'global' || mode === 'local')) {
      const { x, y, height, triggerWidth } = calcSize(triggerRef.current, scrollRef.current, searchRef.current, footerRef.current);
      if (mode === 'global') {
        setGlobalStyle({ left: x, top: y });
      }
      setDropdownStyle({ height: height, width: autoWidth ? triggerWidth : 'auto' });
    }
  }, [innerVisible, triggerRef, scrollRef, searchRef, footerRef, autoWidth, data, mode]);

  useClickAway((e) => {
    if (onClose) {
      onClose(e);
    }
  }, popupRef, 'click');

  const renderIcon = (icon: string | ReactNode) => {
    const iconEle = typeof icon === 'string' ? <img src={icon} alt="" /> : icon;
    return <div className={styles.dropdownIcon}>{iconEle}</div>;
  };

  const isCommon = mode === 'common';

  const positionCls = cls({
    [styles.positionOpen]: !isCommon && innerVisible,
    [styles.positionClose]: !isCommon && !innerVisible,
    [styles.dropdownRealClose]: !isCommon && !realVisible
  });

  const renderNode = (
    <div
      className={cls(styles.dropdownWrap, positionCls)}
      ref={popupRef}
      style={dropdownStyle}
    >
      {searchable && (
        <div className={styles.dropdownSearch} ref={searchRef}>
          <input type="text" />
        </div>
      )}
      <div className={cls(styles.dropdown)} ref={scrollRef}>
        {
          data.map((item, i) => {
            const selectedItem = value.find((v) => item.value === v);
            if (renderItem) {
              return renderItem(item);
            }

            const labelEle = labelInDangerHTML ?
              <div className={styles.dropdownItemLabelText} dangerouslySetInnerHTML={{ __html: item.label }} /> :
              <Typography variant='body2' className={styles.dropdownItemLabelText}>{item.label}</Typography>;

            return (
              <>
                <div
                  key={`${item.value}_${item.label}`}
                  className={cls(styles.dropdownItem, { [styles.dropdownItemSelected]: Boolean(selectedItem) })}
                  onClick={(e) => handleItemClick(item, e)}
                >
                  {selectedMode === 'check' && (
                    <div className={styles.dropdownItemCheckSelected} />
                  )}
                  {renderIcon(item.icon)}
                  <div className={styles.dropdownItemContent}>
                    <div className={styles.dropdownItemLabel}>
                      {labelEle}
                      {item.labelTip && <div className={styles.dropdownItemLabelTip}>{item.labelTip}</div>}
                    </div>
                    {item.describe && <Typography variant='body4' className={styles.dropdownItemDescribe}>{item.describe}</Typography>}
                  </div>
                  {item.extra && <div className={styles.dropdownItemExtra}>{item.extra}</div>}
                  {selectedMode === 'icon' && (
                    <div className={styles.dropdownItemIconSelected}>
                      <SelectOutlined />
                    </div>
                  )}
                </div>
                {divide && i !== data.length - 1 && <div className={styles.dropdownDivide} />}
              </>
            );
          })
        }
      </div>
      {footer && (
        <div className={styles.dropdownFooter} ref={footerRef}>
          {footer}
        </div>
      )}
    </div>
  );

  if (mode === 'global') {
    const containerNode = (
      <div style={globalStyle} className={styles.dropdownGlobal}>
        {renderNode}
        {hoverElement && visible && <div>{hoverElement}</div>}
      </div>
    );
    return ReactDOM.createPortal(containerNode, document.body);
  }

  if (mode === 'local') {
    return (
      <div className={styles.dropdownLocal}>
        {renderNode}
        {hoverElement && visible && <div>{hoverElement}</div>}
      </div>
    );
  }

  return renderNode;
};