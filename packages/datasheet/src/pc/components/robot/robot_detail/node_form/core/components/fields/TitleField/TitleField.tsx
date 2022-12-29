import { useState } from 'react';
import * as React from 'react';
import { IFieldProps } from '../../../interface';
import { IHelp, HelpIconButton } from './style';
import styles from './style.module.less';
import cls from 'classnames';
import { ChevronDownOutlined } from '@apitable/icons';

export const TitleField = (props: Pick<IFieldProps, 'id' | 'title' | 'required'> & {
  help?: IHelp;
  hasCollapse?: boolean;
  defaultCollapse?: boolean;
  onChange?: (collapse: boolean) => void;
  style?: React.CSSProperties;
}) => {
  const { title, id, help, hasCollapse, style, defaultCollapse = false, onChange } = props;
  const [, level] = (id || '').split('-');
  const titleLevel = Math.min(parseInt(level, 10) || 0, 2);
  const titleCls = cls(styles.h, {
    [styles.h1]: titleLevel === 0,
    [styles.h2]: titleLevel === 2,
    [styles.h3]: titleLevel === 3,
    [styles.hasCollapse]: hasCollapse,
  })
  const [collapse, setCollapse] = useState<boolean>(defaultCollapse);

  const switchCollapse = () => {
    if (!hasCollapse) return;
    const newValue = !collapse;
    setCollapse(newValue);
    onChange && onChange(newValue);
  };

  return <div className={titleCls} style={style} id={id} onClick={switchCollapse}>
    {title}
    {help && <HelpIconButton help={help} />}
    {hasCollapse && <span className={cls(styles.suffixIcon, { [styles.isIconRotate]: !collapse })} > <ChevronDownOutlined color="#8C8C8C" /></span>}
  </div>;
};