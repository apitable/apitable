
import { FC } from 'react';
import * as React from 'react';
import styles from './style.module.less';
import IconDot from 'static/icon/common/common_icon_more.svg';
import { useThemeColors } from '@vikadata/components';
import { ViewIcon } from 'pc/components/tool_bar/view_switcher/view_icon';
import { ICustomViewProps } from '../tab';
import { useSelector } from 'react-redux';
import { Selectors, ViewType } from '@vikadata/core';

export interface IDragItemProps {
  left: number;
  // name: string;
  // viewType: ViewType;
  view: ICustomViewProps;
}

export const DragItem: FC<IDragItemProps> = (props) => {
  const colors = useThemeColors();
  const { left, view } = props;
  const { name, type } = view;
  const style = {
    display: 'flex',
    left,
  };
  const currentView = useSelector(Selectors.getCurrentView);
  const isKanbanStyle = currentView && currentView.type === ViewType.Kanban;

  const kanbanStyle: React.CSSProperties = {
    border: `1px solid ${colors.lineColor}`,
    borderBottom: 'none',
    background: 'white',
  };
  return (
    <div style={style} className={styles.dragItemWrapper}>
      {/* <div className={styles.prevDragItem}>
        <div className={styles.item} />
      </div> */}
      <div
        className={styles.dragItem}
      >
        <div
          className={styles.item}
          style={isKanbanStyle ? kanbanStyle : {}}
        >
          <ViewIcon viewType={type} />
          <span>{name}</span>
          {name && (
            <div className={styles.circle}>
              <IconDot width={12} height={12} fill={colors.thirdLevelText} />
            </div>
          )}
        </div>
      </div>
      {/* <div className={styles.nextDragItem}>
        <div className={styles.item} />
      </div> */}

    </div>
  );
};
