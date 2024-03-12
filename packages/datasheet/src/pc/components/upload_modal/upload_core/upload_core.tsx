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
import type { Identifier } from 'dnd-core';
import produce from 'immer';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { IAttacheField, IAttachmentValue, moveArrayElement, RowHeightLevel } from '@apitable/core';
import { ItemTypes } from 'pc/components/gallery_view/constant';
import { IDragItem } from 'pc/components/gallery_view/interface';
import withScrolling from 'pc/components/react-dnd-scrolling';
import { resourceService } from 'pc/resource_service';
import { isTouchDevice, UploadManager } from 'pc/utils';
import { dndH5Manager, dndTouchManager } from 'pc/utils/dnd_manager';
import { stopPropagation } from '../../../utils/dom';
import { PreviewItem } from '../preview_item/preview_item';
import { UploadItem } from '../upload_item';
import { UploadTab } from '../upload_tab';
import { IUploadFileList } from './upload_core.interface';
import styles from './styles.module.less';

const ScrollingComponent = withScrolling('div');

interface IUploadCoreProps {
  recordId: string;
  field: IAttacheField;
  datasheetId: string;
  cellValue: IAttachmentValue[];
  columnCount: 2 | 3 | 4;
  zoneStyle?: React.CSSProperties;
  readonly?: boolean;
  size?: UploadCoreSize;
  rowHeightLevel?: RowHeightLevel;
  onSave?: (cellValue: IAttachmentValue[]) => void;
  getCellValueFn?: (datasheetId: string | undefined, recordId: string, fieldId: string) => IAttachmentValue[];
  className?: string;
}

export enum UploadCoreSize {
  // Only for upload modal box, when there is no uploaded image and no image being uploaded.
  Big = 'Big',
  Normal = 'Normal',
  // Small = 'Small'
}

interface ISortableList {
  cellValue: IAttachmentValue[];
  onSortEnd: () => void;
  datasheetId: string;
  recordId: string;
  field: IAttacheField;
  uploadList: IUploadFileList;
  readonly?: boolean;
  rowHeightLevel?: RowHeightLevel;
  deleteUploadItem: (fileId: string) => void;
  onSave?: (cellValue: IAttachmentValue[]) => void;
  getCellValueFn?: (datasheetId: string | undefined, recordId: string, fieldId: string) => IAttachmentValue[];
  onMove: ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => void;
}

interface ISortableItem {
  item: IAttachmentValue;
  id: string;
  idx: number;
  cellValue: IAttachmentValue[];
  recordId: string;
  field: IAttacheField;
  readonly?: boolean;
  onSave?: (cellValue: IAttachmentValue[]) => void;
  datasheetId: string;
  onSortEnd: () => void;
  onMove: ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => void;
}

const SortableItem = ({ item, id, idx, cellValue, recordId, field, readonly, onSave, datasheetId, onSortEnd, onMove }: ISortableItem) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<
    IDragItem,
    void,
    {
      handlerId: Identifier | null;
    }
  >({
    accept: ItemTypes.CARD,
    drop() {
      onSortEnd();
    },
    hover(item: IDragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = idx;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      const dragItemRect = monitor.getClientOffset()!;
      const dropItemRect = ref.current?.getBoundingClientRect();
      if (
        !(
          dragItemRect.x > dropItemRect.x &&
          dragItemRect.x < dropItemRect.x + dropItemRect.width &&
          dragItemRect.y > dropItemRect.y &&
          dragItemRect.y < dropItemRect.y + dropItemRect.height
        )
      ) {
        return;
      }
      if (item.id === id) {
        return;
      }
      onMove({ oldIndex: dragIndex, newIndex: hoverIndex });
      item.index = hoverIndex;
    },
  });

  const [, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id: item.id, index: idx };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !readonly,
  });

  drag(drop(ref));

  return (
    <div ref={ref}>
      <PreviewItem
        {...item}
        index={idx}
        cellValue={cellValue}
        datasheetId={datasheetId}
        key={item.id}
        recordId={recordId}
        field={field}
        readonly={readonly}
        onSave={onSave}
      />
    </div>
  );
};

const SortableList = ({
  cellValue,
  datasheetId,
  recordId,
  rowHeightLevel,
  field,
  uploadList,
  readonly,
  deleteUploadItem,
  onSave,
  getCellValueFn,
  onSortEnd,
  onMove,
}: ISortableList) => {
  return (
    <div className={styles.sortContainer}>
      {cellValue &&
        cellValue.map((value: IAttachmentValue, index: number) => {
          return (
            <SortableItem
              key={value.id}
              id={value.id}
              idx={index}
              item={value}
              datasheetId={datasheetId}
              cellValue={cellValue}
              recordId={recordId}
              field={field}
              readonly={readonly}
              onSave={onSave}
              onSortEnd={onSortEnd}
              onMove={onMove}
            />
          );
        })}
      {uploadList &&
        uploadList.map((item) => {
          return (
            <UploadItem
              key={item.fileId}
              fileUrl={item.fileUrl}
              recordId={recordId}
              field={field}
              fileId={item.fileId}
              status={item.status}
              file={item.file}
              datasheetId={datasheetId}
              deleteUploadItem={deleteUploadItem}
              rowHeightLevel={rowHeightLevel}
              onSave={onSave}
              getCellValueFn={getCellValueFn}
            />
          );
        })}
    </div>
  );
};

export const UploadCore: React.FC<React.PropsWithChildren<IUploadCoreProps>> = (props) => {
  const {
    recordId,
    field,
    datasheetId,
    columnCount = 4,
    readonly,
    size: propsSize,
    cellValue: _cellValue,
    rowHeightLevel,
    onSave,
    getCellValueFn,
  } = props;
  const uploadManager = resourceService.instance!.uploadManager;
  const [uploadList, setUploadList] = useState<IUploadFileList>(() => {
    const cellId = UploadManager.getCellId(recordId, field.id);
    return uploadManager.get(cellId);
  });

  const [cellValue, setCellValue] = useState(() => {
    return (_cellValue || []).flat();
  });

  useEffect(() => {
    setCellValue(_cellValue);
  }, [JSON.stringify(_cellValue)]);

  const uploadCoreSize = useMemo(() => {
    if (propsSize) {
      return propsSize;
    }
    const count = Number(cellValue?.length) + uploadList.length;
    return count > 0 ? UploadCoreSize.Normal : UploadCoreSize.Big;
  }, [cellValue, uploadList, propsSize]);

  useEffect(() => {
    if (!cellValue || uploadList.length === 0) {
      return;
    }
    const cvIds = cellValue.map((item) => item.id);
    setUploadList((state) => {
      return state.filter((item) => !cvIds.includes(item.fileId));
    });
    // eslint-disable-next-line
  }, [JSON.stringify(cellValue)]);

  function deleteUploadItem(fileId: string) {
    setUploadList((state) => {
      return state.filter((item) => item.fileId !== fileId);
    });
  }

  const onSortEnd = () => {
    onSave && onSave(cellValue);
  };

  const onMove = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const produceCellValue = produce(cellValue, (draft) => {
      moveArrayElement(draft, oldIndex, newIndex);
      return draft;
    });
    setCellValue(produceCellValue);
  };

  return (
    <div onWheel={stopPropagation} className={classNames(styles.uploadTabWrapper, props.className)}>
      {!readonly && (
        <UploadTab
          recordId={recordId}
          fieldId={field.id}
          cellValue={cellValue}
          uploadList={uploadList}
          setUploadList={setUploadList}
          className={classNames({
            [styles.bigSize]: uploadCoreSize === UploadCoreSize.Big,
            [styles.normalSize]: uploadCoreSize === UploadCoreSize.Normal,
          })}
        />
      )}

      <div
        className={classNames({
          [styles.exitList]: true,
          [styles[`columnCount${columnCount}`]]: true,
        })}
      >
        <DndProvider
          manager={isTouchDevice() ? dndTouchManager : dndH5Manager}
          options={{
            delayTouchStart: 300,
          }}
        >
          <ScrollingComponent className={styles.scrollBox}>
            <SortableList
              cellValue={cellValue}
              onSortEnd={onSortEnd}
              datasheetId={datasheetId}
              recordId={recordId}
              field={field}
              uploadList={uploadList}
              readonly={readonly}
              rowHeightLevel={rowHeightLevel}
              deleteUploadItem={deleteUploadItem}
              onSave={onSave}
              getCellValueFn={getCellValueFn}
              onMove={onMove}
            />
          </ScrollingComponent>
        </DndProvider>
      </div>
    </div>
  );
};
