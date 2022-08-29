import { Button } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import { copy2clipBoard } from 'pc/utils';
import { FC } from 'react';
import styles from './style.module.less';
import classNames from 'classnames';

export const MyInviteCode: FC<{ inviteCode: string }> = ({ inviteCode }) => {
  const inviteCodeUrl = `${location.origin}/?inviteCode=${inviteCode}`;

  return (
    <div className={styles.myInviteCode}>
      <div className={styles.rewardTip}>{t(Strings.invite_code_tab_mine_get_v_coin_both)}</div>
      <div className={styles.wayBox}>
        <li className={styles.title}>{t(Strings.invite_code_tab_mine_way_1)}</li>
        <div className={styles.tip}>{t(Strings.invite_code_tab_mine_way_1_tip)}</div>
        <div className={styles.copyBox}>
          <input type="text" className={styles.input} value={inviteCodeUrl} disabled />
          <Button onClick={() => copy2clipBoard(inviteCodeUrl)}>{t(Strings.copy_url)}</Button>
        </div>
      </div>

      <div className={styles.wayBox}>
        <li className={styles.title}>{t(Strings.invite_code_tab_mine_way_2)}</li>
        <div className={styles.tip}>{t(Strings.invite_code_tab_mine_way_2_tip)}</div>
        <div className={styles.copyBox}>
          <input type="text" className={classNames(styles.input, styles.inviteCode)} value={inviteCode} disabled />
          <Button onClick={() => copy2clipBoard(inviteCode)}>{t(Strings.copy_link)}</Button>
        </div>
      </div>
    </div>
  );
};