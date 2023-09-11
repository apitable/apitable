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
import { useThemeColors } from '@apitable/components';
import styles from './style.module.less';

export const OmittedMiddleText: FC<React.PropsWithChildren<{ suffixCount: number; children: string }>> = ({ suffixCount = 5, children }) => {
  const colors = useThemeColors();
  const start = children.slice(0, children.length - suffixCount);
  const suffix = children.slice(-suffixCount);
  return (
    <>
      {children.length > 5 ? (
        <div className={styles.desc}>
          <span className={styles.start} color={colors.thirdLevelText}>
            {start}
          </span>
          <span className={styles.suffix} color={colors.thirdLevelText}>
            {suffix}
          </span>
        </div>
      ) : (
        <p className={styles.desc}>{children}</p>
      )}
    </>
  );
};
