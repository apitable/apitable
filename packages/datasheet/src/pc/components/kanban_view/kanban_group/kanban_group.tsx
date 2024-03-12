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

import classNames from 'classnames';
import { sum } from 'lodash';
import * as React from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { DraggableProvided, Droppable } from 'react-beautiful-dnd';
import { VariableSizeList } from 'react-window';
import { Button, useThemeColors } from '@apitable/components';
import { ConfigConstant, ExecuteResult, FieldType, IKanbanViewProperty, Selectors, Strings, t, UN_GROUP, ViewType } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { useCardHeight } from 'pc/components/common/hooks/use_card_height';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getIsColNameVisible } from 'pc/utils/datasheet';
import { GroupHeader } from '../group_header';
import { useCommand } from '../hooks/use_command';
import { Card, Row } from './rows';
import { MARGIN_DISTANCE } from './rows/rows';
import styles from './styles.module.less';

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

const SCROLL_WIDTH = 16; // The width occupied by the scroll bar

const TOTAL_OTHER_PADDING = 148; // Kanban area, the height of the area other than the display virtual scroll, old -> 138

const TOTAL_PC_OATHER_PADDING = 154; // The height of the area other than the display virtual scrolling on the pc side

const SMALL_SCREEN_PADDING = TOTAL_OTHER_PADDING + 40; // An action area is displayed at the bottom of the mobile screen

const ADD_BUTTON_HEIGHT = 54;

const CARD_MARGIN = 8;

export enum InsertPlace {
  Top,
  Bottom,
}

export function useAddNewCard(groupId: string, cb?: () => void, insertPlace?: InsertPlace) {
  const kanbanFieldId = useAppSelector(Selectors.getKanbanFieldId)!;
  const field = useAppSelector((state) => Selectors.getField(state, kanbanFieldId));
  const kanbanGroupMap = useAppSelector(Selectors.getKanbanGroupMap)!;
  const recordIndex = useAppSelector((state) => {
    const rowIndexMap = Selectors.getRowsIndexMap(state);
    const records = kanbanGroupMap[groupId] || [];
    const targetRecord = insertPlace === InsertPlace.Bottom ? records.length && records[records.length - 1] : records[0];
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
      groupId === UN_GROUP ? [{}] : [{ [kanbanFieldId]: field.type === FieldType.Member ? [groupId] : groupId }],
    );
    if (ExecuteResult.Success === result.result) {
      const recordId: string = result.data && result.data[0];
      expandRecordIdNavigate(recordId);
    }
    cb && cb();
  }

  return addNewRecord;
}

export const KanbanGroup: React.FC<React.PropsWithChildren<IKanbanGroupProps>> = (props) => {
  const colors = useThemeColors();
  const { provided, groupId, height, setCollapse, isDragging, kanbanFieldId, dragId } = props;
  const kanbanGroupMap = useAppSelector(Selectors.getKanbanGroupMap)!;
  const activeView = useAppSelector((state) => Selectors.getCurrentView(state))!;
  const rows = useMemo(() => kanbanGroupMap[groupId] || [], [groupId, kanbanGroupMap]);
  const rowsCount = rows.length;
  const listRef = useRef<VariableSizeList>(null);
  const coverFieldId = useAppSelector((state) => {
    const activeView = Selectors.getCurrentView(state) as IKanbanViewProperty;
    return activeView.style.coverFieldId;
  });
  const isColNameVisible =
    activeView.type !== ViewType.Gantt && activeView.type !== ViewType.Calendar && activeView.type !== ViewType.Grid
      ? getIsColNameVisible(activeView.style.isColNameVisible)
      : true;
  const getCardHeight = useCardHeight({
    cardCoverHeight: 140,
    coverFieldId,
    multiTextMaxLine: 3,
    showEmptyCover: false,
    showEmptyField: false,
    isColNameVisible,
    isVirtual: true,
  });
  const fieldRole = useAppSelector((state) => {
    const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
    return Selectors.getFieldRoleByFieldId(fieldPermissionMap, kanbanFieldId);
  });
  const visibleFields = useAppSelector(Selectors.getVisibleColumns);
  const _rowCreatable = useAppSelector((state) => Selectors.getPermissions(state).rowCreatable);
  const rowCreatable = _rowCreatable && (!fieldRole || fieldRole === ConfigConstant.Role.Editor);
  const keepSort =
    useAppSelector((state) => {
      const sortInfo = Selectors.getActiveViewSortInfo(state);
      return sortInfo && sortInfo.keepSort;
    }) || false;

  const searchRecordId = useAppSelector(Selectors.getCurrentSearchRecordId);
  const showSortBorderRef = useRef(false);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useMemo(() => {
    if (!searchRecordId) {
      return;
    }
    const searchRecordIndex = rows.map((item) => item.id).indexOf(searchRecordId);
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
    listRef.current && listRef.current.resetAfterIndex(0, true);
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
    // The calculation of the virtual list on the pc side after recalibration
    return resCardHeight + extraHeight;
  };

  /**
   * @description
   * After the fields with automatic sorting and column permissions are set as grouped fields of the kanban view,
   * the interaction effect of dragging and sorting will be different,
   * so a different calculation of the list height for virtual scrolling is needed
   *
   * @param {number} baseHeight
   * @param placeholderHeight
   * @returns {number}
   */
  const getFixedListHeight = (baseHeight: number, placeholderHeight: number) => {
    // TODO: Modify the logic here when you have field permissions
    if (!keepSort) {
      return baseHeight + placeholderHeight;
    }
    if (keepSort) {
      return baseHeight;
    }
    return baseHeight;
  };

  return (
    <div {...provided?.draggableProps} ref={provided?.innerRef}>
      {/* TODO: Since the cards can't be dragged after turning on auto sort or in the case of devtool, */}
      {/* it should be related to the tooltip component, so remove tooltip first. */}
      {/* <Tooltip title={t(Strings.kanban_keep_sort_tip)} visible={Boolean(showSortBorder)} align={{ offset: [0, 2] }}> */}
      <div
        style={{
          marginRight: 16,
          marginLeft: groupId === UN_GROUP && isMobile ? 24 : 0,
          marginTop: isMobile ? 24 : 1, // 1 pixel to display automatically sorted dragged lines
        }}
        className={classNames({
          [styles.board]: true,
          [styles.isDragging]: isDragging && groupId === dragId,
        })}
      >
        <GroupHeader groupId={groupId} kanbanGroupMap={kanbanGroupMap} provided={provided} setCollapse={setCollapse} scrollToItem={scrollToItem} />
        <div className={styles.groupContent}>
          <Droppable
            droppableId={groupId || UN_GROUP}
            mode="virtual"
            renderClone={(provided, snapshot, rubric) => {
              const row = rows[rubric.source.index];
              return <Card provided={provided} row={row} style={{}} isDragging={snapshot.isDragging} cardHeight={getCardHeight} groupId={groupId} />;
            }}
          >
            {(provided, snapshot) => {
              /**
               * For the dragging of Kanban cards, no additional consideration is needed if the dragging is within the current group.
               * If you are dragging from group A to group B, you need to consider for example that there are two cards in group B.
               * In order to leave space for the placeHolderCard (i.e., the blank space added for sorting animation,
               * the height is equal to the height of the card being dragged),
               * the number of cards in group B should be 2+1 (i.e., the itemCount mentioned below) and
               * the height of group B should be 2 * cardHeight + 1 * cardHeight (i.e., the height of the card being dragged).
               * The height of group B should be 2 * cardHeight + 1 * placeHolderCardHeight (i.e., the extraHeight mentioned below)
               */
              const recordIds = rows.map((item) => item.id);
              const dragInDiffGroup =
                snapshot.isUsingPlaceholder && !recordIds.includes((snapshot.draggingFromThisWith || snapshot.draggingOverWith)!);
              const itemCount = dragInDiffGroup && !keepSort ? rowsCount + 1 : rowsCount;
              const extraHeight = dragInDiffGroup ? getCardHeight(snapshot.draggingOverWith || '', isMobile) : 0;

              const virtualHeightInner =
                getFixedListHeight(sum(recordIds.map((recordId) => getCardHeight(recordId, isMobile) + CARD_MARGIN)), extraHeight) - CARD_MARGIN;

              const _maxVirtualHeight = height - (isMobile ? SMALL_SCREEN_PADDING : TOTAL_PC_OATHER_PADDING);
              const maxVirtualHeight = !rowCreatable ? _maxVirtualHeight + ADD_BUTTON_HEIGHT : _maxVirtualHeight;
              const isMaxVirtualHeight = virtualHeightInner > maxVirtualHeight;
              const virtualHeight = isMaxVirtualHeight ? maxVirtualHeight : virtualHeightInner;
              showSortBorderRef.current = Boolean(snapshot.isDraggingOver && keepSort);
              return itemCount === 0 ? (
                <div ref={provided.innerRef} className={styles.placeHolder}>
                  {t(Strings.kanban_no_data)}
                </div>
              ) : (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <VariableSizeList
                    // change display record count will change virtualHeight, itemSize should rerender right-now.
                    key={`${virtualHeight}-${visibleFields.length}`}
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
              );
            }}
          </Droppable>
        </div>
        {showSortBorderRef.current && (
          <div className={styles.autoSort}>
            <div className={styles.autoSortTitle}>{t(Strings.kanban_keep_sort_tip)}</div>
            <div className={styles.autoSortSubTitle}>{t(Strings.kanban_keep_sort_sub_tip)}</div>
          </div>
        )}
        {rowCreatable && (
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
        )}
      </div>
      {/* </Tooltip> */}
    </div>
  );
};
