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
} from '@vikadata/core';
import { VariableSizeGrid as Grid } from '@vikadata/react-window';
import { useDebounceFn } from 'ahooks';
import cls from 'classnames';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { stopPropagation } from 'pc/utils';
import { getIsColNameVisible } from 'pc/utils/datasheet';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { shallowEqual, useSelector } from 'react-redux';
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
import styles from './style.module.less';
import { getColumnWidthAndCount, getGalleryLinearRows, getGroupLinearRows, getGroupTitlePaddingTip, getSearchItemIndex } from './utils';

interface IGalleryViewProps {
  height?: number;
  width?: number;
}

export const GalleryViewBase: React.FC<IGalleryViewProps> = ({ width: containerWidth, height }) => {
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
    getCurrentSearchItem,
    getActiveViewGroupInfo,
    getActiveViewSortInfo,
    getGalleryGroupedRows,
    getCellValue,
    getGroupingCollapseIds,
    getGroupLevel,
    getSnapshot,
    getFieldPermissionMap,
  } = Selectors;
  const datasheetId = useSelector(getActiveDatasheetId)!;
  const {
    groupInfo,
    _visibleRecords,
    rowsIndexMap,
    activeView,
    galleryStyle,
    currentSearchItem,
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
  } = useSelector(state => {
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
      currentSearchItem: getCurrentSearchItem(state),
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
      res.groupRows = getGalleryGroupedRows(state);
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
    /*
    展开:
      add dom
      do transition
    收起:
      do transition
      remove dom
    */
    // 初始化与展开走这里添加数据
    if (isGrouped && groupingCollapseIds != null && groupingCollapseIds.length !== lastTransitionIds.length) {
      const arr: string[] = [];
      groupRows.forEach(eachGroupRows => {
        const groupHeadRecordId = eachGroupRows[0];
        if (groupingCollapseIds.includes(groupHeadRecordId)) {
          arr.push(groupHeadRecordId);
        }
      });
      if (groupingCollapseIds.length < lastTransitionIds.length) {
        // 需要展开时，设置动画效果
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

  // 上下滚动一屏
  const pageUpOrPageDown = (down: boolean) => {
    const gridEle = ReactDOM.findDOMNode(galleryViewRef.current) as Element;
    if (down) {
      gridEle.scrollTop += height || 0;
    } else {
      gridEle.scrollTop -= height || 0;
    }
  };

  // 滚动到顶部/底部
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

  // 计算没列显示多少个卡片，每个卡片的宽度。
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

  // 20 = 卡片上下内边距，16 = 卡片容器项边距
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
    if (currentSearchItem) {
      galleryViewRef &&
        galleryViewRef.current &&
        galleryViewRef.current.scrollToItem(getSearchItemIndex(currentSearchItem as string, linearRows, _visibleRecords, columnCount, isGrouped));
    }
  }, [currentSearchItem, _visibleRecords, columnCount, linearRows, isGrouped]);

  // 释放鼠标 drop 时，提交排序。
  const commitMove = () => {
    if (!commitRef.current) {
      return;
    }
    const { dragRecordId, dropRecordId, direction } = commitRef.current;
    const commandManager = resourceService.instance!.commandManager;
    const data = [
      {
        recordId: dragRecordId,
        overTargetId: dropRecordId,
        direction,
      },
    ];
    commandManager!.execute({
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

  // 拖动卡片时动态排序，将 drag 和 drop 的 recordId 记录下来。
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
    recordId => {
      if (groupingCollapseIds == null) return;
      // 有 recordId 被认为是隐藏，会先做动画，再移除 dom
      // 展开动画时，由于会先添加 dom，所以会先移除 groupingCollapseIds 的 headId，所以此处无需再额外设置 setTransitionRecordIds
      if (recordId) {
        setTransitionRecordIds(recordIds => [...recordIds, recordId]);
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
  const itemKey = ({ columnIndex, rowIndex }) => {
    const realIndex = columnIndex + rowIndex * columnCount;
    const record = linearRows[realIndex];
    if (!record) return realIndex;
    const recordId = record.recordId;
    return `${record.type}_${recordId}`;
  };

  // 根据字段类型返回对应高度，高度 = 内容 + padding
  const getRowHeightByFieldType = (field: IField, paddingTop: number) => {
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
          // 存在内容为空的情况，需要获取是否有值
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
          columnWidth={index => cardWidth}
          rowCount={linearRows.length}
          rowHeight={index => getRowHeight(index)}
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
