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

import classnames from 'classnames';
import Image from 'next/image';
import { FC } from 'react';
import { Button } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import styles from './style.module.less';

export interface IModeItemProps {
  className?: string;
  img: string;
  modeName: string;
  name: string;
  state: boolean;
  bindingTime: string;
  onClick: () => void;
}

export const ModeItem: FC<React.PropsWithChildren<IModeItemProps>> = ({ className, img, name, state, modeName, bindingTime, onClick }) => {
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
      <Button size="small" color={state ? 'danger' : 'primary'} onClick={onClick}>
        {state ? t(Strings.unbind) : t(Strings.bind)}
      </Button>
    </div>
  );
};
