import { Strings, t } from '@apitable/core';
import Image from 'next/image';
import { FC } from 'react';
import GoldImg from 'static/icon/workbench/workbench_account_gold_icon.png';
import styles from './style.module.less';

export const BubbleBox: FC = () => {
  return (
    <div className={styles.bubbleBox}>
      <div className={styles.arrow} />
      {t(Strings.v_coins_1000)}
      <span className={styles.goldCoin}>
        <Image src={GoldImg} />
      </span>
    </div>
  );
};
