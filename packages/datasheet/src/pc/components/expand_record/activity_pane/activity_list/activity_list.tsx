import { FC, useContext, useRef, useState } from 'react';
import styles from './style.module.less';
import { ActivityListItems, IActivityListProps } from './activity_list_items';
import cls from 'classnames';
import { ActivitySelectType } from 'pc/utils';
import { ActivityContext } from '../activity_context';

export const ActivityList: FC<IActivityListProps> = props => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = useState(true);

  const { replyText } = useContext(ActivityContext);

  return (
    <div className={styles.activityContainer} ref={containerRef}>
      <div className={cls(styles.activityList, {
        [styles.isReply]: Boolean(replyText),
        [styles.empty]: empty,
        [styles.allowComment]: props.selectType !== ActivitySelectType.Changeset
      })} ref={listRef}>
        <ActivityListItems
          {...props}
          containerRef={containerRef}
          listRef={listRef}
          setEmpty={setEmpty}
        />
      </div>
    </div>
  );
};
