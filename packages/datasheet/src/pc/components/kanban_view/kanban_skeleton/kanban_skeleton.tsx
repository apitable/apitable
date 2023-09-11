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

import { useThemeColors, Skeleton } from '@apitable/components';
import styles from './styles.module.less';

export const KanbanSkeleton = () => {
  const colors = useThemeColors();

  const list = [
    { rows: 4, color: colors.blackBlue[400] },
    { rows: 2, color: colors.deepPurple[100] },
    { rows: 3, color: colors.indigo[100] },
    { rows: 1, color: colors.blue[100] },
  ];

  return (
    <div className={styles.container}>
      {list.map((v) => {
        return (
          <div key={v.rows} className={styles.board}>
            <div className={styles.colorLine} style={{ background: v.color }} />
            <Skeleton disabledAnimation className={styles.tag} style={{ background: v.color }} />
            <Skeleton count={v.rows} height="132px" className={styles.card} disabledAnimation />
          </div>
        );
      })}
    </div>
  );
};
