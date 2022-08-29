import { Button } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import classnames from 'classnames';
import Image from 'next/image';
import { FC } from 'react';
import styles from './style.module.less';

export interface IModeItemProps {
  className?: string;
  /** 绑定方式的图片 */
  img: string;
  /** 绑定方式的名称 */
  modeName: string;
  /** 绑定的账号昵称 */
  name: string;
  /** 绑定状态 */
  state: boolean;
  /** 绑定时间 */
  bindingTime: string;
  /** 点击解绑或绑定按钮的事件 */
  onClick: () => void;
}

export const ModeItem: FC<IModeItemProps> = ({
  className,
  img,
  name,
  state,
  modeName,
  bindingTime,
  onClick,
}) => {

  return (
    <div className={classnames(styles.modeItem, className)}>
      <span className={styles.img}>
        <Image src={img} alt={modeName} />
      </span>
      <div className={styles.infoContainer}>
        <div className={styles.title}>{modeName}</div>
        <div className={styles.infoItem}>
          <div className={styles.label}>{t(Strings.bind_state)}</div>
          <div className={styles.value}>{state ? t(Strings.bound) : t(Strings.unbound)}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.label}>{t(Strings.bind_time)}</div>
          <div className={styles.value}>{bindingTime ? bindingTime : <div className={styles.defaultLine} />}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.label}>{t(Strings.account_nickname)}</div>
          <div className={styles.value}>{name ? name : <div className={styles.defaultLine} />}</div>
        </div>
      </div>
      <Button size="small" color={state ? 'danger' : 'primary'} onClick={onClick}>{state ? t(Strings.unbind) : t(Strings.bind)}</Button>
    </div>
  );
};
