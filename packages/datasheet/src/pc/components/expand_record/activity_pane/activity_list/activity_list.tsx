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

import cls from 'classnames';
import { FC, useContext, useRef, useState } from 'react';
import { ActivitySelectType } from 'pc/utils';
import { ActivityContext } from '../activity_context';
import { ActivityListItems, IActivityListProps } from './activity_list_items';
import styles from './style.module.less';

export const ActivityList: FC<React.PropsWithChildren<IActivityListProps>> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = useState(true);

  const { replyText } = useContext(ActivityContext);

  return (
    <div className={styles.activityContainer} ref={containerRef}>
      <div
        className={cls(styles.activityList, {
          [styles.isReply!]: Boolean(replyText),
          [styles.empty!]: empty,
          [styles.allowComment!]: props.selectType !== ActivitySelectType.Changeset,
        })}
        ref={listRef}
      >
        <ActivityListItems {...props} containerRef={containerRef} listRef={listRef} setEmpty={setEmpty} />
      </div>
    </div>
  );
};
