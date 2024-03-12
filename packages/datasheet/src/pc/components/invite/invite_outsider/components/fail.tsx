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
import { t, Strings } from '@apitable/core';
import { WarnOutlined } from '@apitable/icons';
import styles from './style.module.less';

interface IErrorContentProps {
  err?: string;
  init: () => void;
}
export const Fail: FC<React.PropsWithChildren<IErrorContentProps>> = (props) => {
  const { err, init } = props;
  return (
    <div className={styles.fail}>
      <span className={styles.errorIcon}>
        <WarnOutlined />
      </span>
      <div className={styles.text}>
        <div className={styles.gray}>
          {t(Strings.please)}
          <span onClick={init} className={styles.reload}>
            {t(Strings.upload_again)}
          </span>
        </div>
      </div>
    </div>
  );
};
