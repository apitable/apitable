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

import { useDebounceFn } from 'ahooks';
import cls from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { shallowEqual } from 'react-redux';
import { VariableSizeGrid as Grid } from 'react-window';
import {
  CollaCommandName,
  DATASHEET_ID,
  DropDirectionType,
  ExecuteResult,
  Field,
  FieldType,
  ICellValue,
  IField,
  LookUpField,
  Selectors,
  IGridViewProperty,
  ViewType,
} from '@apitable/core';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { getIsColNameVisible } from 'pc/utils/datasheet';
import { ScreenSize } from '../common/component_display';
import { useCardHeight } from '../common/hooks/use_card_height';
import { expandRecordIdNavigate } from '../expand_record';
import { AddRecord } from '../mobile_grid/add_record';
import { RecordMenu } from '../multi_grid/context_menu/record_menu';
import { dependsGroup2ChangeData } from '../multi_grid/drag';
import { GalleryItemCard } from './card';
import {
  GalleryGroupItemType,
  GROUP_TITLE_CHECKBOX_HEIGHT,
  GROUP_TITLE_DEFAULT_HEIGHT,
  GROUP_TITLE_PERSON_HEIGHT,
  GROUP_TITLE_RATING_HEIGHT,
  ONE_COLUMN_MODE_CONTAINER_WIDTH,
  PADDING_BOTTOM,
} from './constant';
import { ICommitDragDropState } from './interface';
import { getColumnWidthAndCount, getGalleryLinearRows, getGroupLinearRows, getGroupTitlePaddingTip, getSearchItemIndex } from './utils';
import styles from './style.module.less';

interface IGalleryViewProps {
  height?: number;
  width?: number;
}

export const GalleryViewBase: React.FC<React.PropsWithChildren<IGalleryViewProps>> = ({ width: containerWidth, height }) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const {
    getCurrentView,
    getPureVisibleRows,
    getRowsIndexMap,
    getVisibleColumns,
    getFieldMap,
    getCurrentGalleryViewStyle,
    getActiveDatasheetId,
    getPermissions,
    getCurrentSearchRecordId,
    getActiveViewGroupInfo,
    getActiveViewSortInfo,
    getGalleryGroupedRows,
    getCellValue,
    getGroupingCollapseIds,
    getGroupLevel,
    getSnapshot,
    getFieldPermissionMap,
  } = Selectors;
  const datasheetId = useAppSelector(getActiveDatasheetId)!;
  const {
    groupInfo,
    _visibleRecords,
    rowsIndexMap,
    activeView,
    galleryStyle,
    currentSearchRecordId,
    permissions,
    visibleFields,
    fieldMap,
    keepSort,
    groupRows,
    groupingCollapseIds,
    field,
    state,
    groupLevel,
    snapshot,
    fieldPermissionMap,
    templateId,
    editable,
  } = useAppSelector((state) => {
    const groupInfo = getActiveViewGroupInfo(state);
    const isGrouped = groupInfo && groupInfo.length;
    const snapshot = getSnapshot(state)!;
    const datasheet = Selectors.getDatasheet(state);
    const res = {
      fieldMap: getFieldMap(state, datasheetId)!,
      _visibleRecords: getPureVisibleRows(state),
      visibleFields: getVisibleColumns(state),
      galleryStyle: getCurrentGalleryViewStyle(state),
      activeView: getCurrentView(state)!,
      rowsIndexMap: getRowsIndexMap(state),
      permissions: getPermissions(state),
      currentSearchRecordId: getCurrentSearchRecordId(state),
      groupInfo,
      keepSort: getActiveViewSortInfo(state)?.keepSort,
      groupRows: [[]] as string[][],
      groupingCollapseIds: getGroupingCollapseIds(state),
      field: groupInfo.length > 0 && snapshot.meta.fieldMap[groupInfo[0].fieldId],
      state,
      snapshot,
      groupLevel: getGroupLevel(state),
      fieldPermissionMap: getFieldPermissionMap(state),
      templateId: state.pageParams.templateId,
      editable: datasheet?.permissions.editable,
    };
    if (isGrouped) {
      res.groupRows = getGalleryGroupedRows(state)!;
    }
    return res;
  }, shallowEqual);
  const viewId = activeView.id;
  const [transitionRecordIds, setTransitionRecordIds] = React.useState<string[]>([]);
  const [lastTransitionIds, setLastTransitionIds] = React.useState<string[]>([]);
  const galleryViewRef = useRef<Grid>(null);
  const [visibleRecords, setVisibleRecords] = useState(_visibleRecords);
  const commitRef = useRef<ICommitDragDropState>();

  const isGrouped = groupInfo && groupInfo.length > 0;

  const setVisibleTransition = () => {
    if (isGrouped && groupingCollapseIds != null && groupingCollapseIds.length !== lastTransitionIds.length) {
      const arr: string[] = [];
      groupRows.forEach((eachGroupRows) => {
        const groupHeadRecordId = eachGroupRows[0];
        if (groupingCollapseIds.includes(groupHeadRecordId)) {
          arr.push(groupHeadRecordId);
        }
      });
      if (groupingCollapseIds.length < lastTransitionIds.length) {
        setTransitionRecordIds(arr);
      }
      setLastTransitionIds(groupingCollapseIds);
    }
  };
  const { run, cancel } = useDebounceFn(setVisibleTransition, { wait: 0 });
  useEffect(() => {
    run();
    return () => {
      cancel();
    };
  });

  useEffect(() => {
    setVisibleRecords(_visibleRecords);
  }, [_visibleRecords]);

  useEffect(() => {
    const eventBundle = new Map([
      [
        ShortcutActionName.PageDown,
        () => {
          pageUpOrPageDown(true);
        },
      ],
      [
        ShortcutActionName.PageUp,
        () => {
          pageUpOrPageDown(false);
        },
      ],
      [
        ShortcutActionName.PageDownEdge,
        () => {
          pageUpEdgeOrPageDownEdge(true);
        },
      ],
      [
        ShortcutActionName.PageUpEdge,
        () => {
          pageUpEdgeOrPageDownEdge(false);
        },
      ],
    ]);

    eventBundle.forEach((cb, key) => {
      ShortcutActionManager.bind(key, cb);
    });

    return () => {
      eventBundle.forEach((_cb, key) => {
        ShortcutActionManager.unbind(key);
      });
    };
  });

  const addRecord = (index: number, cellValue?: { [fieldId: string]: ICellValue }) => {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      count: 1,
      viewId,
      index,
      cellValues: cellValue ? [cellValue] : undefined,
    });
    const recordId = 'data' in result && result.data && result.data[0];
    if (ExecuteResult.Success === result.result && !rowsIndexMap.has(recordId)) {
      expandRecordIdNavigate(recordId);
    }
  };

  const pageUpOrPageDown = (down: boolean) => {
    const gridEle = ReactDOM.findDOMNode(galleryViewRef.current) as Element;
    if (down) {
      gridEle.scrollTop += height || 0;
    } else {
      gridEle.scrollTop -= height || 0;
    }
  };

  const pageUpEdgeOrPageDownEdge = (down: boolean) => {
    const gridEle = ReactDOM.findDOMNode(galleryViewRef.current) as Element;
    if (down) {
      gridEle.scrollTop += gridEle.scrollHeight - (height || 0);
    } else {
      gridEle.scrollTop = 0;
    }
  };

  function toMobileImgHeight(height: number) {
    return isMobile ? 178 : height;
  }

  // Calculate how many cards to display in each column and the width of each card.
  const { columnCount, cardWidth } = getColumnWidthAndCount(containerWidth!, isMobile, galleryStyle!);
  const isOneColumnMode = columnCount === 1;
  const cardCoverHeight = toMobileImgHeight(columnCount > 3 ? 240 : 320);
  const isColNameVisible =
    activeView.type !== ViewType.Gantt && activeView.type !== ViewType.Grid ? getIsColNameVisible(activeView.style.isColNameVisible) : true;

  const getCardHeight = useCardHeight({
    cardCoverHeight,
    isColNameVisible,
    coverFieldId: galleryStyle!.coverFieldId!,
    showEmptyCover: true,
    showEmptyField: true,
    isVirtual: true,
    isGallery: true,
    titleHeight: 14,
  });

  const cardHeight = getCardHeight(null, isMobile) + 20 + 16;
  // const showAddCard = permissions.rowCreatable;
  const showAddCard = Boolean(!templateId && editable);
  const linearRows = useMemo(() => {
    if (isGrouped) {
      return getGroupLinearRows(groupRows, groupingCollapseIds || [], showAddCard, columnCount);
    }
    return getGalleryLinearRows(_visibleRecords, showAddCard);
  }, [groupRows, showAddCard, columnCount, isGrouped, _visibleRecords, groupingCollapseIds]);

  useEffect(() => {
    galleryViewRef.current?.resetAfterRowIndex(0, true);
  }, [linearRows]);

  useEffect(() => {
    galleryViewRef.current?.resetAfterColumnIndex(0, true);
  }, [cardWidth]);

  useEffect(() => {
    if (currentSearchRecordId) {
      galleryViewRef &&
        galleryViewRef.current &&
        galleryViewRef.current.scrollToItem(getSearchItemIndex(currentSearchRecordId, linearRows, _visibleRecords, columnCount, isGrouped));
    }
  }, [currentSearchRecordId, _visibleRecords, columnCount, linearRows, isGrouped]);

  const commitMove = () => {
    if (!commitRef.current) {
      return;
    }
    const { dragRecordId, dropRecordId, direction } = commitRef.current;
    const data = [
      {
        recordId: dragRecordId,
        overTargetId: dropRecordId,
        direction,
      },
    ];
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.MoveRow,
      viewId,
      data,
      recordData: dependsGroup2ChangeData(data, dropRecordId, {
        groupLevel,
        snapshot,
        view: activeView as IGridViewProperty,
        fieldPermissionMap,
      }),
    });
  };

  // Dynamic sorting when dragging cards, recording the recordId of drag and drop.
  const moveCard = (dragIndex: number, hoverIndex: number, direction: DropDirectionType) => {
    commitRef.current = {
      dragRecordId: visibleRecords[dragIndex].recordId,
      dropRecordId: visibleRecords[hoverIndex].recordId,
      direction,
    };
  };

  const onChangeGroupCollapse = () => {
    galleryViewRef.current?.resetAfterRowIndex(0, true);
  };

  const onDoTransition = React.useCallback(
    (recordId: any) => {
      if (groupingCollapseIds == null) return;
      if (recordId) {
        setTransitionRecordIds((recordIds) => [...recordIds, recordId]);
      }
    },
    [groupingCollapseIds, setTransitionRecordIds],
  );

  const itemContextData = {
    // method
    moveCard,
    commitMove,
    addRecord,
    // data
    datasheetId,
    viewId,
    visibleRecords,
    visibleFields,
    fieldMap,
    cardHeight,
    columnCount,
    cardWidth,
    galleryStyle,
    imageHeight: cardCoverHeight,
    keepSort,
    rowSortable: permissions.rowSortable,
    isGrouped,
    linearRows,
    onChangeGroupCollapse,
    groupInfo,
    onDoTransition,
    transitionRecordIds,
    groupRows,
    _visibleRecords,
  };
  const itemKey = ({ columnIndex, rowIndex }: { columnIndex: number; rowIndex: number }) => {
    const realIndex = columnIndex + rowIndex * columnCount;
    const record = linearRows[realIndex];
    if (!record) return realIndex;
    const recordId = record.recordId;
    return `${record.type}_${recordId}`;
  };

  const getRowHeightByFieldType = (field: IField, paddingTop: number): number => {
    switch (field.type) {
      case FieldType.Text:
      case FieldType.URL:
      case FieldType.Email:
      case FieldType.Phone:
      case FieldType.SingleText:
      case FieldType.DateTime:
      case FieldType.CreatedTime:
      case FieldType.LastModifiedTime:
      case FieldType.Number:
      case FieldType.Currency:
      case FieldType.Percent:
      case FieldType.AutoNumber:
      case FieldType.Formula:
        return GROUP_TITLE_DEFAULT_HEIGHT + paddingTop;
      case FieldType.SingleSelect:
      case FieldType.MultiSelect:
      case FieldType.Link:
      case FieldType.Member: // return GROUP_TITLE_SELECT_LINK_HEIGHT + paddingTop;
      case FieldType.CreatedBy:
      case FieldType.LastModifiedBy:
        return GROUP_TITLE_PERSON_HEIGHT + paddingTop;
      case FieldType.Checkbox:
        return GROUP_TITLE_CHECKBOX_HEIGHT + paddingTop;
      case FieldType.Rating:
        return GROUP_TITLE_RATING_HEIGHT + paddingTop;
      case FieldType.LookUp: {
        const realField = (Field.bindModel(field) as LookUpField).getLookUpEntityField();
        if (realField) {
          return getRowHeightByFieldType(realField, paddingTop);
        }
        return GROUP_TITLE_DEFAULT_HEIGHT + paddingTop;
      }
      default:
        return GROUP_TITLE_DEFAULT_HEIGHT + paddingTop;
    }
  };

  const getRowHeight = (rowIndex: number) => {
    const realIndex = rowIndex * columnCount;
    const record = linearRows[realIndex];
    if (!record) return 0;
    switch (record.type) {
      case GalleryGroupItemType.Card:
      case GalleryGroupItemType.AddCard:
      case GalleryGroupItemType.BlankCard:
        return cardHeight;
      case GalleryGroupItemType.GroupHeadBlank:
      case GalleryGroupItemType.GroupTitle: {
        const paddingTop = getGroupTitlePaddingTip(linearRows, realIndex - 1, rowIndex);
        if (field) {
          // There are cases where the content is empty and you need to get if there is a value
          const cellValue = getCellValue(state, snapshot, record.recordId, field.id);
          return cellValue ? getRowHeightByFieldType(field, paddingTop) : GROUP_TITLE_DEFAULT_HEIGHT + paddingTop;
        }
        return GROUP_TITLE_DEFAULT_HEIGHT + paddingTop;
      }
      default:
        return 0;
    }
  };
  return (
    <>
      <div onContextMenu={stopPropagation} className={cls(styles.galleryViewContainer, { [styles.galleryViewContainerMobile]: isMobile })}>
        <Grid
          ref={galleryViewRef}
          width={isOneColumnMode ? ONE_COLUMN_MODE_CONTAINER_WIDTH : innerWidth!}
          height={height!}
          style={{
            overflowX: 'hidden',
            paddingBottom: PADDING_BOTTOM,
          }}
          columnCount={columnCount}
          columnWidth={() => cardWidth}
          rowCount={linearRows.length}
          key={cardHeight}
          rowHeight={(index) => getRowHeight(index)}
          itemKey={itemKey}
          itemData={itemContextData}
        >
          {GalleryItemCard}
        </Grid>
        {permissions.rowCreatable &&
          ReactDOM.createPortal(<AddRecord size={isMobile ? 'large' : 'default'} />, document.getElementById(DATASHEET_ID.ADD_RECORD_BTN)!)}
      </div>
      <RecordMenu insertDirection={'horizontal'} />
    </>
  );
};

export const GalleryView = React.memo(GalleryViewBase);
