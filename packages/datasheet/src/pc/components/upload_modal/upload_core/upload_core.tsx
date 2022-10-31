import { IAttachmentValue, IField, RowHeightLevel, moveArrayElement } from '@apitable/core';
import classNames from 'classnames';
import produce from 'immer';
import { resourceService } from 'pc/resource_service';
import { UploadManager } from 'pc/utils';
import { useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
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

const SortableItem = SortableElement(({
  item,
  idx,
  cellValue,
  recordId,
  field,
  readonly,
  onSave,
  datasheetId
}) => {
  return (
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
  );
});

const SortableList = SortableContainer(({
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
}) => {

  return (
    <div className={styles.sortContainer}>
      {
        cellValue && cellValue.map((value, index) => {
          return (
            <SortableItem
              key={value.id}
              index={index}
              idx={index}
              item={value}
              datasheetId={datasheetId}
              cellValue={cellValue}
              recordId={recordId}
              field={field}
              readonly={readonly}
              onSave={onSave}
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
});

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

  const cellValue: IAttachmentValue[] = useMemo(() => {
    return (_cellValue || []).flat();
  }, [_cellValue]);

  const uploadCoreSize = useMemo(() => {
    if (propsSize) {
      return propsSize;
    }
    const count = cellValue.length + uploadList.length;
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

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const produceCellValue = produce(cellValue, draft => {
      moveArrayElement(draft, oldIndex, newIndex);
      return draft;
    });
    onSave && onSave(produceCellValue);
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
        <SortableList
          cellValue={cellValue}
          onSortEnd={onSortEnd}
          axis="xy"
          datasheetId={datasheetId}
          recordId={recordId}
          field={field}
          distance={1}
          uploadList={uploadList}
          readonly={readonly}
          rowHeightLevel={rowHeightLevel}
          deleteUploadItem={deleteUploadItem}
          onSave={onSave}
          getCellValueFn={getCellValueFn}
        />
      </div>
    </div>
  );
};

