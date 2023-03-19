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

import { FC } from 'react';
import styles from './style.module.less';
import { Star2Filled } from '@apitable/icons';
import classNames from 'classnames';
import { getLanguage, Strings, t } from '@apitable/core';

interface IUpgradeBtnProps {
  onClick: () => void
}

export const UpgradeBtn: FC<React.PropsWithChildren<IUpgradeBtnProps>> = ({ onClick }) => {
  const isZhCN = getLanguage() === 'zh-CN';
  return (
    <div
      className={styles.stickyUpgrade}
      style={{ height: isZhCN ? undefined : 120 }}
    >
      <div
        className={styles.stickyUpgradeContent}
        onClick={onClick}
      >
        <Star2Filled />
        <span className={classNames(styles.stickyUpgradeText, { rotate: !isZhCN })}>
          {t(Strings.upgrade_pure)}
        </span>
      </div>
    </div>
  );
};
