import { IAttachmentValue, IField, moveArrayElement, RowHeightLevel } from '@apitable/core';
import classNames from 'classnames';
import type { Identifier } from 'dnd-core';
import produce from 'immer';
import { ItemTypes } from 'pc/components/gallery_view/constant';
import { IDragItem } from 'pc/components/gallery_view/interface';
import { resourceService } from 'pc/resource_service';
import { UploadManager } from 'pc/utils';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { stopPropagation } from '../../../utils/dom';
import { PreviewItem } from '../preview_item/preview_item';
import { UploadItem } from '../upload_item';
import { UploadTab } from '../upload_tab';
import styles from './styles.module.less';
import { IUploadFileList } from './upload_core.interface';

interface IUploadCoreProps {
  recordId: string;
  field: IField;
  datasheetId: string;
  cellValue: IAttachmentValue[];
  columnCount: 2 | 3 | 4;
  zoneStyle?: React.CSSProperties;
  readonly?: boolean;
  size?: UploadCoreSize;
  rowHeightLevel?: RowHeightLevel;
  onSave?: (cellValue: IAttachmentValue[]) => void;
  getCellValueFn?: (datasheetId: string | undefined, recordId: string, fieldId: string) => IAttachmentValue[],
  className?: string;
}

export enum UploadCoreSize {
  // Only for upload modal box, when there is no uploaded image and no image being uploaded.
  Big = 'Big',
  Normal = 'Normal',
  // Small = 'Small'
}

const SortableItem = (
  {
    item,
    id,
    idx,
    cellValue,
    recordId,
    field,
    readonly,
    onSave,
    datasheetId,
    onSortEnd,
    onMove
  }
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<IDragItem, void, { handlerId: Identifier | null }>(
    {
      accept: ItemTypes.CARD,
      drop(item: IDragItem, monitor) {
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
        if (!(
          dragItemRect.x > dropItemRect.x && dragItemRect.x < dropItemRect.x + dropItemRect.width &&
          dragItemRect.y > dropItemRect.y && dragItemRect.y < dropItemRect.y + dropItemRect.height
        )) {
          return;
        }
        if (item.id === id) {
          return;
        }
        onMove({ oldIndex: dragIndex, newIndex: hoverIndex });
        item.index = hoverIndex;

      },
    }
  );

  const [, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id: item.id, index: idx };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
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

const SortableList = (
  {
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
    onMove
  }
) => {
  return (
    <div className={styles.sortContainer}>
      {
        cellValue && cellValue.map((value, index) => {
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
        })
      }
      {
        uploadList && uploadList.map((item) => {
          return (
            <UploadItem
              key={(item.fileId)}
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
        })
      }
    </div>
  );
};

export const UploadCore: React.FC<IUploadCoreProps> = props => {
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
  const [uploadList, setUploadList] = useState<IUploadFileList>(
    () => {
      const cellId = UploadManager.getCellId(recordId, field.id);
      return uploadManager.get(cellId);
    },
  );

  const [cellValue, setCellValue] = useState(() => {
    return (_cellValue || []).flat();
  });

  useEffect(() => {
    setCellValue(_cellValue);
  }, [_cellValue]);

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
    const cvIds = cellValue.map(item => item.id);
    setUploadList(state => {
      return state.filter(item => !cvIds.includes(item.fileId));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellValue]);

  function deleteUploadItem(fileId: string) {
    setUploadList(state => {
      return state.filter(item => item.fileId !== fileId);
    });
  }

  const onSortEnd = () => {
    onSave && onSave(cellValue);
  };

  const onMove = ({ oldIndex, newIndex }) => {
    const produceCellValue = produce(cellValue, draft => {
      moveArrayElement(draft, oldIndex, newIndex);
      return draft;
    });
    setCellValue(produceCellValue);
  };

  return (
    <div
      onWheel={stopPropagation}
      className={classNames(styles.uploadTabWrapper, props.className)}
    >
      {
        !readonly &&
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
      }

      <div
        className={classNames({
          [styles.exitList]: true,
          [styles[`columnCount${columnCount}`]]: true,
        })}
      >
        <DndProvider backend={HTML5Backend}>
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
        </DndProvider>

      </div>
    </div>
  );
};

