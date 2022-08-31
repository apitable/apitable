import React, { ChangeEvent, FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import cls from 'classnames';

import { stopPropagation } from '@vikadata/components';

import { Tag } from '../tag';
import { Dropdown, IDropdownItem } from '../dropdown';

import { ISelect } from './interface';

import styles from './style.module.less';

export const Select: FC<ISelect> = ({
  data,
  value,
  suffix,
  prefix,
  placeholder,
  mode='tag',
  className,
  wrapClassName,
  labelInDangerHTML,
  maxRow,
  visible: selectVisible,
  onSearch,
  onChange,
  renderValue,

  // 下拉
  autoWidth,
  dropdownFooter,
  empty,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const keywordRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(5);
  const [keyword, setKeyword] = useState('');
  const [visible, setVisible] = useState(false);

  const handleClick = (e) => {
    setVisible(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCloseDropdown = (e: Event) => {
    const selectEle = selectRef.current;
    if (!selectEle) return;
    if (!selectEle.contains(e.target as HTMLElement)) {
      setVisible(false);
    }
  };

  const handleBlur = (e) => {
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch && onSearch(e);
    setKeyword(e.target.value);
  };

  const handleChange = (item: IDropdownItem, e: React.MouseEvent<HTMLElement>) => {
    const newValue: string[] = [...value];
    if (mode === 'tag' || mode === 'multiple') {
      const itemIndex = value.indexOf(item.value);
      if (itemIndex === -1) {
        newValue.push(item.value);
      } else {
        newValue.splice(itemIndex, 1);
      }
    } else {
      newValue.push(item.value);
    }

    if (onChange) {
      onChange(newValue, item, e);
    }
  };

  const handleRemoveTag = (item: IDropdownItem, e: React.MouseEvent<HTMLElement>) => {
    stopPropagation(e);

    handleChange(item, e);
  };

  useLayoutEffect(() => {
    if (keywordRef.current)
      setWidth(keywordRef.current.scrollWidth || 5);
  }, [keyword]);

  useEffect(() => {
    if (selectVisible !== undefined) {
      setVisible(selectVisible);
    }
  }, [selectVisible]);

  const contentStyle: React.CSSProperties = {};
  if (maxRow) {
    contentStyle.maxHeight = maxRow * 28;
    contentStyle.overflowY = 'auto';
  }

  const renderSelectValue = () => {
    if (renderValue) {
      return renderValue();
    }

    if (mode === 'tag' || mode === 'multiple') {
      return value.map((v) => {
        const res = data.find((item) => item.value === v);
        if (res) {
          return mode === 'tag' ? 
            <Tag
              childrenInDangerHTML={labelInDangerHTML}
              icon={res.icon}
              className={styles.selectTag}
              key={res.value}
              closable
              onClose={(e) => handleRemoveTag(res, e)}
            >
              {res.label}
            </Tag> :
            <span key={res.value}>{res.label}</span>;
        }
        return res;
      });
    }
    const singleItem = data.find((item) => item.value === value[0]);
    return singleItem && <span>{singleItem.label}</span>;
  };

  return (
    <div className={cls(styles.selectWrap, wrapClassName)}>
      <div
        className={cls(styles.selectContainer, {
          [styles.selectTag]: mode === 'tag'
        }, className)}
        onClick={handleClick}
        ref={selectRef}
      >
        {prefix && <div className={styles.selectPrefix}>{prefix}</div>}
        <div className={styles.selectContent} style={contentStyle}>
          {placeholder && value.length === 0 && !keyword && width <= 5 && <div className={styles.selectPlaceholder}>{placeholder}</div>}
          {renderSelectValue()}
          <input
            style={{ width }}
            type="text"
            ref={inputRef}
            onChange={handleSearch}
            value={keyword}
            onBlur={handleBlur}
          />
          <span className={styles.selectKeyword} ref={keywordRef}>{keyword}</span>
        </div>
        {suffix && <div className={styles.selectSuffix}>{suffix}</div>}
      </div>
      <Dropdown
        triggerRef={selectRef}
        autoWidth={autoWidth}
        labelInDangerHTML={labelInDangerHTML}
        data={data}
        value={value}
        mode='global'
        visible={visible}
        empty={empty}
        footer={dropdownFooter}
        onClick={handleChange}
        onClose={handleCloseDropdown}
      />
    </div>
  );
};