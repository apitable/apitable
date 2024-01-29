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

import { isEqual } from 'lodash';
import { useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { CellType, FieldType, Selectors } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { UploadManager } from 'pc/utils';
import { GRID_ROW_HEAD_WIDTH } from '../constant';

interface IAttachmentEvent {
  instance: any;
  gridBound: { x: number; y: number };
  scrollTop: number;
  scrollLeft: number;
  offsetX: number;
}

export const useAttachmentEvent = (props: IAttachmentEvent) => {
  const { instance, gridBound, scrollTop, scrollLeft, offsetX } = props;

  const { datasheetId, visibleColumns, fieldMap, linearRows, snapshot } = useAppSelector((state) => {
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    return {
      datasheetId,
      visibleColumns: Selectors.getVisibleColumns(state),
      fieldMap: Selectors.getFieldMap(state, datasheetId)!,
      linearRows: Selectors.getLinearRows(state)!,
      snapshot: Selectors.getSnapshot(state)!,
    };
  }, shallowEqual);

  const wheelingRef = useRef<number | null>(null);
  const [draggingOutlineInfo, setDraggingOutlineInfo] = useState<{ rowIndex: number; columnIndex: number } | null>(null);
  const { frozenColumnWidth } = instance;

  const getCellInfoByPosition = (e: any) => {
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
      columnIndex,
    };
  };

  const onDrop = (e: any) => {
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
        uploadManager.generateSuccessFn(recordId, fieldId, { name: file.name, id: fileId }, datasheetId),
        UploadManager.generateFormData(file, datasheetId),
        fileId,
      );
    });
  };

  const onDragOver = (e: any) => {
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
    setDraggingOutlineInfo,
  };
};
