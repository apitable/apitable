import { IKanbanViewProperty, IRecord, Selectors } from '@apitable/core';
import classNames from 'classnames';
import { ScreenSize } from 'pc/components/common/component_display';
import { GRID_RECORD_MENU } from 'pc/components/multi_grid/context_menu/record_menu';
import { useResponsive } from 'pc/hooks';
import * as React from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { RecordCard } from '../../../record_card/card';
import styles from '../styles.module.less';
import { useContextMenu } from '@vikadata/components';
import { getIsColNameVisible } from 'pc/utils/datasheet';

// Spacing between top and bottom cards
export const MARGIN_DISTANCE = 8;

interface ICardProps {
  provided: DraggableProvided;
  row: IRecord;
  style: React.CSSProperties;
  cardHeight: (recordId: string, isMobile?: boolean) => number;
  groupId: string;
  isLastCard?: boolean;
  isDragging?: boolean;
  className?: string;
}

export const Card: React.FC<ICardProps> = props => {
  const { provided, row, style, isDragging, cardHeight, groupId, className } = props;
  const kanbanFieldId = useSelector(Selectors.getKanbanFieldId)!;
  const activeView = useSelector(state => Selectors.getCurrentView(state)) as IKanbanViewProperty;
  const rowsIndexMap = useSelector(Selectors.getRowsIndexMap);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { show } = useContextMenu({
    id: GRID_RECORD_MENU,
  });

  function onContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    show(e as React.MouseEvent<HTMLElement>, {
      props: {
        recordIndex: rowsIndexMap.get(row.id)!,
        count: 1,
        cellValue: { [kanbanFieldId]: groupId },
        recordId: row.id,
      },
    });
  }

  const height = cardHeight(row.id, isMobile);

  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className={classNames(
        {
          [styles.cardWrapper]: true,
          [styles.isDragging]: isDragging,
        },
        className,
      )}
      style={{
        ...provided.draggableProps.style,
        ...style,
        height,
        marginBottom: 0,
        cursor: 'pointer',
        width: 'auto',
      }}
      onContextMenu={onContextMenu}
      tabIndex={0}
      onMouseDown={() => {
        document.activeElement?.dispatchEvent(new Event('blur'));
      }}
    >
      <RecordCard
        showEmptyCover={false}
        coverFieldId={activeView.style.coverFieldId}
        showEmptyField={false}
        multiTextMaxLine={4}
        coverHeight={140}
        cardWidth={240}
        isCoverFit={activeView.style.isCoverFit}
        isColNameVisible={getIsColNameVisible(activeView.style.isColNameVisible)}
        recordId={row.id}
        bodyClassName={styles.kanbanCardBody}
        isVirtual
      />
    </div>
  );
};

interface IRowBaseProps {
  data: {
    rows: IRecord[];
    cardHeight: (recordId: string) => number;
    groupId: string;
    dragInDiffGroup: boolean;
    keepSort: boolean;
  };
  index: number;
  style: React.CSSProperties;
}

const RowBase: React.FC<IRowBaseProps> = props => {
  const { data: items, index, style } = props;
  const { rows, cardHeight, groupId, keepSort } = items;
  const row = rows[index];
  const rowSortable = useSelector(state => Selectors.getPermissions(state).rowSortable);
  // Leave space for PlaceHolder rendering
  if (!row) {
    return null;
  }

  const getHidePlaceholderCls = () => {
    if (keepSort) {
      return styles.hidePlaceholder;
    }
    return '';
  };

  return (
    <Draggable draggableId={row.id} index={index} key={row.id} isDragDisabled={!rowSortable}>
      {provided => (
        <Card
          provided={provided}
          row={row}
          style={style}
          cardHeight={cardHeight}
          groupId={groupId}
          isLastCard={index === rows.length - 1}
          className={getHidePlaceholderCls()}
        />
      )}
    </Draggable>
  );
};

export const Row = React.memo(RowBase);
