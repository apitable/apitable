import { CellType, FieldType, Selectors } from '@apitable/core';
import { shallowEqual, useSelector } from 'react-redux';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { UploadManager } from 'pc/utils';
import { GRID_ROW_HEAD_WIDTH } from '../constant';
import { useRef, useState } from 'react';
import { isEqual } from 'lodash';

export const useAttachmentEvent = (props) => {
  const { 
    instance, 
    gridBound, 
    scrollTop, 
    scrollLeft, 
    offsetX, 
  } = props;

  const {
    datasheetId,
    visibleColumns,
    fieldMap,
    linearRows,
    snapshot,
  } = useSelector((state) => {
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    return {
      datasheetId,
      visibleColumns: Selectors.getVisibleColumns(state),
      fieldMap: Selectors.getFieldMap(state, datasheetId)!,
      linearRows: Selectors.getLinearRows(state),
      snapshot: Selectors.getSnapshot(state)!,
    };
  }, shallowEqual);

  const wheelingRef = useRef<number | null>(null);
  const [draggingOutlineInfo, setDraggingOutlineInfo] = useState<{ rowIndex: number; columnIndex: number; } | null>(null);
  const { frozenColumnWidth } = instance;

  const getCellInfoByPosition = (e) => {
    const x = scrollLeft + e.pageX - gridBound.x - offsetX;
    const y = scrollTop + e.pageY - gridBound.y;
    const frozenRange = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
    if (x < frozenRange) return null;
    const rowIndex = instance.getRowStartIndex(y);
    const columnIndex = instance.getColumnStartIndex(x);
    const { recordId, type } = linearRows[rowIndex];
    const { fieldId } = visibleColumns[columnIndex];
    const { type: fieldType } = fieldMap[fieldId];
    if (fieldType !== FieldType.Attachment || type !== CellType.Record) return null; 
    return {
      recordId,
      fieldId,
      rowIndex,
      columnIndex
    };
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDraggingOutlineInfo(null);
    const files: File[] = Array.from(e.dataTransfer.files);
    const cellInfo = getCellInfoByPosition(e);
    const state = store.getState();
    if (cellInfo == null) return;
    const { fieldId, recordId } = cellInfo;
    const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
    const uploadManager = resourceService.instance!.uploadManager;
    const fileDataList = uploadManager.buildStdUploadList(files, recordId, fieldId, cellValue);
    const cellId = UploadManager.getCellId(recordId, fieldId);
    fileDataList.forEach(({ file, fileId }) => {
      uploadManager.register(
        cellId,
        uploadManager.generateSuccessFn(
          recordId, fieldId, { name: file.name, id: fileId }, datasheetId
        ),
        UploadManager.generateFormData(file, datasheetId),
        fileId,
      );
    });
  };

  const onDragOver = (e) => {
    if (wheelingRef.current) return;
    e.persist();
    e.preventDefault();
    wheelingRef.current = window.requestAnimationFrame(() => {
      const cellInfo = getCellInfoByPosition(e);
      wheelingRef.current = null;
      if (cellInfo == null) return setDraggingOutlineInfo(null); 
      const { rowIndex, columnIndex } = cellInfo;
      if (!isEqual(draggingOutlineInfo, { rowIndex, columnIndex })) {
        setDraggingOutlineInfo({ rowIndex, columnIndex });
      }
    });
  };

  return {
    onDrop,
    onDragOver,
    draggingOutlineInfo,
    setDraggingOutlineInfo
  };
};