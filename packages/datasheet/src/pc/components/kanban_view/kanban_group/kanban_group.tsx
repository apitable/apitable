import { ConfigConstant, ExecuteResult, FieldType, IKanbanViewProperty, Selectors, Strings, t, UN_GROUP, ViewType } from '@vikadata/core';
import { VariableSizeList } from '@vikadata/react-window';
import classNames from 'classnames';
import { useCardHeight } from 'pc/components/common/hooks/use_card_height';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { DraggableProvided, Droppable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { GroupHeader } from '../group_header';
import { useCommand } from '../hooks/use_command';
import { Card, Row } from './rows';
import styles from './styles.module.less';
import { sum } from 'lodash';
import { useResponsive } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { MARGIN_DISTANCE } from './rows/rows';
import { Button, useThemeColors } from '@vikadata/components';
import { AddOutlined } from '@vikadata/icons';
import { getIsColNameVisible } from 'pc/utils/datasheet';
interface IKanbanGroupProps {
  groupId: string;
  height: number;
  kanbanFieldId: string;
  setCollapse: (value: string[]) => void;
  provided?: DraggableProvided;
  isDragging?: boolean;
  isLastGroup?: boolean;
  dragId?: string;
}

export const BOARD_WIDTH = 240;

const SCROLL_WIDTH = 16; // 滚动条占据的宽度

const TOTAL_OTHER_PADDING = 148; // 看板区域，除了展示虚拟滚动之外的其他区域的高度, old -> 138

const TOTAL_PC_OATHER_PADDING = 154; // pc 端除了展示虚拟滚动之外的其他区域的高度

const SMALL_SCREEN_PADDING = TOTAL_OTHER_PADDING + 40; // 手机端屏幕底部会显示一个操作区域

const ADD_BUTTON_HEIGHT = 54;

const CARD_MARGIN = 8;

export enum InsertPlace {
  Top,
  Bottom,
}

export function useAddNewCard(groupId: string, cb?: () => void, insertPlace?: InsertPlace) {
  const kanbanFieldId = useSelector(Selectors.getKanbanFieldId)!;
  const field = useSelector(state => Selectors.getField(state, kanbanFieldId));
  const kanbanGroupMap = useSelector(Selectors.getKanbanGroupMap)!;
  const recordIndex = useSelector(state => {
    const rowIndexMap = Selectors.getRowsIndexMap(state);
    const records = kanbanGroupMap[groupId] || [];
    const targetRecord = insertPlace === InsertPlace.Bottom ?
      records.length && records[records.length - 1] : records[0];
    if (!targetRecord) {
      return 0;
    }
    const targetIndex = rowIndexMap.get(targetRecord.id)!;
    return insertPlace === InsertPlace.Bottom ? targetIndex + 1 : targetIndex;
  });
  const command = useCommand();

  function addNewRecord() {
    const result = command.addRecords(
      recordIndex,
      1,
      groupId === UN_GROUP ? [{}] :
        [{ [kanbanFieldId]: field.type === FieldType.Member ? [groupId] : groupId }],
    );
    if (
      ExecuteResult.Success === result.result
    ) {
      const recordId: string = result.data && result.data[0];
      expandRecordIdNavigate(recordId);
    }
    cb && cb();
  }

  return addNewRecord;
}

export const KanbanGroup: React.FC<IKanbanGroupProps> = props => {
  const colors = useThemeColors();
  const { provided, groupId, height, setCollapse, isDragging, kanbanFieldId, dragId } = props;
  const kanbanGroupMap = useSelector(Selectors.getKanbanGroupMap)!;
  const activeView = useSelector(state => Selectors.getCurrentView(state))!;
  const rows = useMemo(() => kanbanGroupMap[groupId] || [], [groupId, kanbanGroupMap]); 
  const rowsCount = rows.length;
  const listRef = useRef<VariableSizeList>(null);
  const coverFieldId = useSelector(state => {
    const activeView = Selectors.getCurrentView(state) as IKanbanViewProperty;
    return activeView.style.coverFieldId;
  });
  const isColNameVisible = (activeView.type !== ViewType.Gantt && activeView.type !== ViewType.Calendar && activeView.type !== ViewType.Grid) ?
    getIsColNameVisible(activeView.style.isColNameVisible) : true;
  const getCardHeight = useCardHeight({
    cardCoverHeight: 140,
    coverFieldId,
    multiTextMaxLine: 4,
    showEmptyCover: false,
    showEmptyField: false,
    isColNameVisible,
    isVirtual: true,
  });
  const fieldRole = useSelector(state => {
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
    return Selectors.getFieldRoleByFieldId(fieldPermissionMap, kanbanFieldId);
  });
  const _rowCreatable = useSelector(state => Selectors.getPermissions(state).rowCreatable);
  const rowCreatable = _rowCreatable && (!fieldRole || fieldRole === ConfigConstant.Role.Editor);
  const keepSort = useSelector(state => {
    const sortInfo = Selectors.getActiveViewSortInfo(state);
    return sortInfo && sortInfo.keepSort;
  });

  const searchRecordId = useSelector(Selectors.getCurrentSearchItem);

  const [showSortBorder, setShowSortBorder] = useState(false);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useMemo(() => {
    if (!searchRecordId) {
      return;
    }
    const searchRecordIndex = rows.map(item => item.id).indexOf(searchRecordId as string);
    if (searchRecordIndex < 0) {
      return;
    }
    listRef.current && listRef.current.scrollToItem(searchRecordIndex);
  }, [searchRecordId, rows]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (list) {
      list.scrollTo(0);
    }
  }, []);

  useEffect(() => {
    listRef.current && listRef.current.resetAfterIndex(0);
  }, [rows]);

  function scrollToItem(index: number) {
    if (!listRef.current) {
      return;
    }
    setTimeout(() => {
      listRef.current!.scrollToItem(index);
    }, 0);
  }

  const addNewRecord = useAddNewCard(
    groupId,
    () => {
      if (rows) {
        scrollToItem(rows?.length + 1);
      }
    },
    InsertPlace.Bottom,
  );

  const cardHeight = (rowIndex: number, extraHeight = 0) => {
    const record = rows[rowIndex];
    if (!record) {
      return 0;
    }
    const resCardHeight = getCardHeight(record.id, isMobile);
    if (rowIndex === rows.length - 1) {
      return resCardHeight;
    }
    // pc 端的虚拟列表重新校对后的计算方式
    return resCardHeight + extraHeight;
  };

  /**
   * @description 存在自动排序和列权限的字段被设置为看板的分组字段后，拖动排序的交互效果会有区别，所以需要对虚拟滚动的列表高度做出不同的计算
   * @param {number} baseHeight
   * @param {number} placeholderHeight
   * @param {boolean} isHomeGroup
   * @returns {number}
   */
  const getFixedListHeight = (baseHeight: number, placeholderHeight: number, isHomeGroup: boolean) => {
    // TODO: 有了列权限后修改这里的逻辑
    if (!keepSort) {
      return baseHeight + placeholderHeight;
    }
    if (keepSort) {
      return baseHeight;
    }
    return baseHeight;
  };

  return (
    <div
      {...provided?.draggableProps}
      ref={provided?.innerRef}
    >
      {/* TODO: 这里有个奇怪的 Bug，开启自动排序后。开启 devtool 的情况下，卡片无法拖动，和 tooltip 组件有关。先取消 tooltip */}
      {/* <Tooltip title={t(Strings.kanban_keep_sort_tip)} visible={Boolean(showSortBorder)} align={{ offset: [0, 2] }}> */}
      <div
        style={{
          marginRight: 16,
          marginLeft: groupId === UN_GROUP && isMobile ? 24 : 0,
          marginTop: isMobile ? 24 : 1, // 1 个像素用来显示自动排序拖动的线条
        }}
        className={classNames({
          [styles.board]: true,
          [styles.isDragging]: isDragging && groupId === dragId,
        })}
      >
        <GroupHeader
          groupId={groupId}
          kanbanGroupMap={kanbanGroupMap}
          provided={provided}
          setCollapse={setCollapse}
          scrollToItem={scrollToItem}
        />
        <div className={styles.groupContent}>
          <Droppable
            droppableId={groupId || UN_GROUP}
            mode="virtual"
            renderClone={(provided, snapshot, rubric) => {
              const row = rows[rubric.source.index];
              return (
                <Card
                  provided={provided}
                  row={row}
                  style={{}}
                  isDragging={snapshot.isDragging}
                  cardHeight={getCardHeight}
                  groupId={groupId}
                />
              );
            }}
          >
            {(provided, snapshot) => {
              // 对于看板卡片的拖动，需要区分是在当前分组内的拖动，或者从 分组A 拖动到 分组B。
              // 如果是前者，不需要额外考虑
              // 但如果是第二种，假设 分组B 原本存在两个卡片，为了给 placeHolderCard（i.e.,为了排序动画而增加的空白的位置，高度等同于正在拖动卡片的高度）留下空间
              // 分组B 的卡片数量应该是 2+1（i.e.,下面提到的 itemCount）
              // 分组B 的高度应该是 2 * cardHeight + 1 * placeHolderCardHeight（i.e.,下面提到的 extraHeight ）
              const recordIds = rows.map(item => item.id);
              const dragInDiffGroup = snapshot.isUsingPlaceholder &&
                !recordIds.includes((snapshot.draggingFromThisWith || snapshot.draggingOverWith)!);
              const itemCount = (dragInDiffGroup && !keepSort) ? rowsCount + 1 : rowsCount;
              const extraHeight = dragInDiffGroup ? getCardHeight(snapshot.draggingOverWith || '', isMobile) : 0;

              const virtualHeightInner = getFixedListHeight(
                sum(
                  recordIds.map(recordId => getCardHeight(recordId, isMobile) + CARD_MARGIN),
                ),
                extraHeight,
                !dragInDiffGroup,
              ) - CARD_MARGIN;

              const _maxVirtualHeight = height - (isMobile ? SMALL_SCREEN_PADDING : TOTAL_PC_OATHER_PADDING);
              const maxVirtualHeight = !rowCreatable ? _maxVirtualHeight + ADD_BUTTON_HEIGHT : _maxVirtualHeight;
              const isMaxVirtualHeight = virtualHeightInner > maxVirtualHeight;
              const virtualHeight = isMaxVirtualHeight ? maxVirtualHeight : virtualHeightInner;
              if (snapshot.isDraggingOver && keepSort) {
                setShowSortBorder(true);
              } else {
                setShowSortBorder(false);
              }
              return (
                itemCount === 0 ? (
                  <div ref={provided.innerRef} className={styles.placeHolder}>
                    {t(Strings.kanban_no_data)}
                  </div>
                ): (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <VariableSizeList
                      // height={
                      //   isMobile ? (virtualHeight - (2 * MARGIN_DISTANCE)) : virtualHeight
                      // }
                      height={virtualHeight}
                      itemCount={itemCount}
                      itemSize={(rowIndex) => cardHeight(rowIndex, MARGIN_DISTANCE)}
                      width={BOARD_WIDTH + SCROLL_WIDTH}
                      itemData={{ rows, cardHeight: getCardHeight, groupId, keepSort, dragInDiffGroup }}
                      ref={listRef}
                      style={{
                        overflowX: 'hidden',
                      }}
                      className={styles.fixList}
                    >
                      {Row}
                    </VariableSizeList>
                  </div>
                )
              );
            }}
          </Droppable>
        </div>
        {showSortBorder && (
          <div className={styles.autoSort}>
            <div className={styles.autoSortTitle}>{t(Strings.kanban_keep_sort_tip)}</div>
            <div className={styles.autoSortSubTitle}>{t(Strings.kanban_keep_sort_sub_tip)}</div>
          </div>
        )}
        {
          rowCreatable &&
          <div style={{ padding: '8px 16px 0 16px' }}>
            <Button
              prefixIcon={<AddOutlined />}
              onClick={addNewRecord}
              className={classNames({
                [styles.addButton]: true,
                [styles.isDragging]: isDragging,
              })}
              block
              color={colors.defaultBg}
            />
          </div>
        }
      </div>
      {/* </Tooltip> */}
    </div>
  );
};
