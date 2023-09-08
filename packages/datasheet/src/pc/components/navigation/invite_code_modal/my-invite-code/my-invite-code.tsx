/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import classNames from 'classnames';
import { FC } from 'react';
import { Button } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { copy2clipBoard } from 'pc/utils';
import styles from './style.module.less';

export const MyInviteCode: FC<React.PropsWithChildren<{ inviteCode: string }>> = ({ inviteCode }) => {
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
