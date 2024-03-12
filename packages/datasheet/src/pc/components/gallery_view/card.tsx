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
import classNames from 'classnames';
import { XYCoord } from 'dnd-core';
import { CSSProperties, useEffect } from 'react';
import * as React from 'react';
import { DragSourceMonitor, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { shallowEqual, useDispatch } from 'react-redux';
import { areEqual } from 'react-window';
import { useContextMenu, TextButton, useThemeColors } from '@apitable/components';
import { DropDirectionType, Selectors, Strings, t, StoreActions, IViewRow } from '@apitable/core';
import { AddOutlined, TriangleDownFilled } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { GRID_RECORD_MENU } from 'pc/components/multi_grid/context_menu/record_menu';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getIsColNameVisible } from 'pc/utils/datasheet';
import { StorageName, setStorage } from 'pc/utils/storage/storage';
import { RecordCard } from '../record_card/card';
import { GalleryGroupItemType, ItemTypes } from './constant';
import { GroupCardTitle } from './group_card_title';
import { IDragItem } from './interface';
import { getAddValue, getGroupTitlePaddingTip } from './utils';
import styles from './style.module.less';

interface IGalleryItemCardBase {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
  data: any;
}

const GalleryItemCardBase = ({ columnIndex, rowIndex, style, data }: IGalleryItemCardBase) => {
  const colors = useThemeColors();
  const {
    visibleRecords,
    columnCount,
    cardWidth,
    cardHeight,
    galleryStyle,
    imageHeight,
    linearRows,
    moveCard,
    commitMove,
    addRecord,
    keepSort,
    rowSortable,
    onChangeGroupCollapse,
    groupInfo,
    onDoTransition,
    transitionRecordIds,
    isGrouped,
    _visibleRecords,
  } = data;

  const { datasheetId, templateId, editable, viewId, groupingCollapseIds, isSearching } = useAppSelector((state) => {
    const datasheet = Selectors.getDatasheet(state);
    return {
      datasheetId: Selectors.getActiveDatasheetId(state),
      templateId: state.pageParams.templateId,
      editable: datasheet?.permissions.editable,
      viewId: state.pageParams.viewId,
      groupingCollapseIds: Selectors.getGroupingCollapseIds(state),
      isSearching: Boolean(Selectors.getSearchKeyword(state)),
    };
  }, shallowEqual);
  const dispatch = useDispatch();
  const isOneColumnMode = columnCount === 1;
  const singleColumnIndex = columnIndex + rowIndex * columnCount;
  const index = singleColumnIndex;
  const cardItem = linearRows[singleColumnIndex];
  const showAdd = !templateId && editable;
  const recordId: string = cardItem?.recordId;
  const groupHeadId: string = cardItem?.groupHeadRecordId;
  const groupingCollapseIdsMap = new Map<string, boolean>(groupingCollapseIds?.map((v) => [v, true]));
  const coverFieldId = galleryStyle.coverFieldId;
  const ref = React.useRef<HTMLDivElement>(null);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { show } = useContextMenu({
    id: GRID_RECORD_MENU,
  });
  const canCollapse = transitionRecordIds.includes(groupHeadId);

  const dispatchDOMDisplay = (recordId: string) => {
    if (isSearching || !datasheetId) return;
    if (groupingCollapseIdsMap.has(recordId)) {
      groupingCollapseIdsMap.delete(recordId);
    } else {
      groupingCollapseIdsMap.set(recordId, true);
    }
    const newState = Array.from(groupingCollapseIdsMap.keys());
    dispatch(StoreActions.setGroupingCollapse(datasheetId, newState));
    // QuickAppend The component display depends on the hoverRecordId,
    // which should be cleared in the case of group collapses to avoid visual misleadingness
    dispatch(StoreActions.setHoverRecordId(datasheetId, null));
    setStorage(StorageName.GroupCollapse, { [`${datasheetId},${viewId}`]: newState });
    onChangeGroupCollapse();
  };

  const { run, cancel } = useDebounceFn(dispatchDOMDisplay, { wait: 100 });

  useEffect(
    () => () => {
      cancel();
    },
    [cancel],
  );

  function onContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    show(e as React.MouseEvent<HTMLElement>, {
      props: {
        recordId: recordId,
        recordIndex: index,
      },
    });
  }
  const changeGroupCollapseState = (recordId: string) => {
    if (isSearching || !datasheetId) return;
    if (!canCollapse) {
      onDoTransition(recordId);
      run(recordId);
    } else {
      dispatchDOMDisplay(recordId);
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: recordId, index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !keepSort && rowSortable,
  });

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop() {
      commitMove();
    },
    hover(item, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      let dragIndex = (item as IDragItem).index;
      let hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const dragItemRect = monitor.getClientOffset();
      const dropItemRect = ref.current?.getBoundingClientRect();
      const currentX = (dragItemRect as XYCoord).x;
      const dropStartX = dropItemRect.left;
      const dropEndX = dropStartX + dropItemRect.width;
      const dropMiddleX = dropStartX + (dropEndX - dropStartX) / 2;
      if (currentX < dropStartX || currentX > dropEndX) {
        return;
      }

      const direction = currentX < dropMiddleX ? DropDirectionType.BEFORE : DropDirectionType.AFTER;

      if (isGrouped) {
        const dragItem = linearRows[dragIndex];
        const dropItem = linearRows[hoverIndex];
        if (!dragItem || !dropItem) {
          return;
        }
        dragIndex = _visibleRecords.findIndex((v: IViewRow) => v.recordId === dragItem.recordId);
        hoverIndex = _visibleRecords.findIndex((v: IViewRow) => v.recordId === dropItem.recordId);
      }

      if (dragIndex === -1 || hoverIndex === -1) {
        return;
      }
      moveCard(dragIndex, hoverIndex, direction);
    },
  });

  drag(drop(ref));

  const opacity = isDragging || canCollapse ? 0 : 1;
  let transitionStyle: React.CSSProperties = {};
  if (canCollapse) {
    transitionStyle = { height: 0, padding: 0, overflow: 'hidden' };
  }
  const WIDTH = isMobile ? cardWidth - 24 : cardWidth - 16;
  const cardStyle = { padding: '16px 8px 0' };

  const mobileStyle = isMobile
    ? {
      paddingTop: 16,
      paddingLeft: 10,
      paddingRight: 0,
      paddingBottom: 0,
    }
    : {};

  if (!recordId) {
    return null;
  }
  if (cardItem.type === GalleryGroupItemType.GroupHeadBlank) {
    return (
      <div
        style={{
          ...style,
          padding: '0 8px 0',
          ...mobileStyle,
        }}
        className={styles.cardGroupTitle}
      />
    );
  }

  if (cardItem.type === GalleryGroupItemType.GroupTitle) {
    const paddingTop = getGroupTitlePaddingTip(linearRows, singleColumnIndex - 1, rowIndex);
    return (
      <div
        style={{
          ...style,
          padding: `${paddingTop}px 8px 0`,
          ...mobileStyle,
        }}
        className={styles.cardGroupTitle}
      >
        <div
          className={styles.icon}
          style={{
            transition: 'all 0.3s',
            transform: groupingCollapseIds && groupingCollapseIds.includes(recordId) ? 'rotate(-90deg)' : 'rotate(0)',
          }}
          onClick={() => changeGroupCollapseState(recordId)}
        >
          <TriangleDownFilled color={colors.thirdLevelText} size={10} />
        </div>
        <GroupCardTitle recordId={recordId} />
      </div>
    );
  }

  if (cardItem.type === GalleryGroupItemType.BlankCard) {
    return (
      <div
        style={{
          ...style,
          ...transitionStyle,
          cursor: 'default',
          ...cardStyle,
          opacity,
          ...mobileStyle,
        }}
        className={styles.card}
      />
    );
  }
  if (cardItem.type === GalleryGroupItemType.AddCard) {
    if (!showAdd) return null;
    const fieldId = groupInfo?.[0]?.fieldId;

    return (
      <div
        style={{
          ...style,
          ...transitionStyle,
          ...cardStyle,
          opacity,
          ...mobileStyle,
        }}
        className={styles.card}
        onClick={() => addRecord(visibleRecords.length, getAddValue(recordId, fieldId))}
      >
        <div
          className={classNames(styles.addNewRecordCard, styles.innerCard, {
            [styles.innerCardForOneColumnMode!]: isOneColumnMode,
          })}
          style={{
            borderRadius: 4,
            width: WIDTH,
            height: cardHeight - 16,
          }}
        >
          <TextButton prefixIcon={<AddOutlined size={14} color="currentColor" />} size={'small'}>
            {t(Strings.add_record)}
          </TextButton>
        </div>
      </div>
    );
  }
  return (
    <div
      ref={ref}
      style={{
        ...style,
        ...transitionStyle,
        ...cardStyle,
        opacity,
        ...mobileStyle,
      }}
      className={styles.card}
      onContextMenu={onContextMenu}
    >
      <RecordCard
        datasheetId={datasheetId}
        recordId={recordId}
        isCoverFit={galleryStyle.isCoverFit}
        isColNameVisible={getIsColNameVisible(galleryStyle.isColNameVisible)}
        cardWidth={WIDTH}
        coverHeight={imageHeight}
        showEmptyField
        multiTextMaxLine={4}
        coverFieldId={coverFieldId}
        showEmptyCover
        className={classNames(styles.innerCard, {
          [styles.innerCardForOneColumnMode!]: isOneColumnMode,
        })}
        isGallery
      />
    </div>
  );
};

export const GalleryItemCard = React.memo(GalleryItemCardBase, areEqual);
