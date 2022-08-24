import { ChangeEvent, useLayoutEffect, useRef, useState } from 'react';
import cls from 'classnames';

import { Tag } from '../tag';

import { ISelect } from './interface';

import styles from './style.module.less';

export const Select = (props: ISelect) => {
  const { data, value, suffix, prefix, placeholder, onSearch, mode='tag', className, wrapClassName } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const keywordRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(5);
  const [keyword, setKeyword] = useState('');

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch && onSearch(e);
    setKeyword(e.target.value);
  };

  useLayoutEffect(() => {
    if (keywordRef.current)
      setWidth(keywordRef.current.scrollWidth || 5);
  }, [keyword]);

  const renderValue = () => {
    if (mode === 'tag') {
      return value.map((v) => {
        const res = data.find((item) => item.value === v);
        return res && <Tag className={styles.selectTag} key={res.value}>{res.label}</Tag>;
      });
    }
    return value[0];
  };

  return (
    <div className={cls(styles.selectWrap, wrapClassName)}>
      <div
        className={cls(styles.selectContainer, {
          [styles.selectTag]: mode === 'tag'
        }, className)}
        onClick={handleClick}
      >
        {prefix && <div className={styles.selectPrefix}>{prefix}</div>}
        <div className={styles.selectContent}>
          {placeholder && value.length === 0 && width <= 5 && <div className={styles.selectPlaceholder}>{placeholder}</div>}
          {renderValue()}
          <input
            style={{ width }}
            type="text"
            ref={inputRef}
            onChange={handleChange}
            value={keyword}
          />
          <span className={styles.selectKeyword} ref={keywordRef}>{keyword}</span>
        </div>
        {suffix && <div className={styles.selectSuffix}>{suffix}</div>}
      </div>
    </div>
  );
};