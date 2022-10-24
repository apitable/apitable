import { Strings, t } from '@apitable/core';
import Image from 'next/image';
import { FC } from 'react';
import Empty from 'static/icon/workbench/notification/workbench_img_no_notification.png';
import styles from './style.module.less';

export const NoData: FC = () => {
  return (
    <div className={styles.invalidMsg}>
      <div className={styles.img}>
        <Image src={Empty} alt="empty" />
      </div>
      <div className={styles.text}>{t(Strings.no_notification)}</div>
    </div>
  );
};
