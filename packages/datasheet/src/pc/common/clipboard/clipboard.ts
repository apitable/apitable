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

import {
  CollaCommandManager,
  CollaCommandName,
  ConfigConstant,
  ExecuteResult,
  FieldType,
  IAttachmentValue,
  ICollaCommandExecuteResult,
  IField,
  IGridViewColumn,
  IGridViewProperty,
  IRange,
  IReduxState,
  isImage,
  IStandardValueTable,
  IViewColumn,
  IViewRow,
  Range,
  Selectors,
  StoreActions,
  Strings,
  t,
  ViewType,
} from '@apitable/core';
import { Message } from 'pc/components/common/message/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { store } from 'pc/store';
import { UploadManager } from 'pc/utils/upload_manager';
import { browser } from '../../../modules/shared/browser';
import { ShortcutContext } from '../../../modules/shared/shortcut_key/shortcut_key';
import { recogClipboardURLData } from './clip_data_url_recog';
import { ISerializer, Serializer } from './serializer';

interface IGetCutRangeDataReturn {
  datasheetId: string;
  columns: IViewColumn[];
  rows: IViewRow[];
}

function getCutRangeData(state: IReduxState, range: IRange): IGetCutRangeDataReturn {
  const numberRange = Range.bindModel(range).toNumberBaseRange(state)!;
  const { row, rowCount, column, columnCount } = numberRange;
  const _columns = Selectors.getVisibleColumns(state).slice(column, column + columnCount);

  // If permissions are set for a column and the user currently operating does not have edit permissions, the data should be filtered during the cut
  const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
  const columns = _columns.filter((column) => {
    const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, column.fieldId);
    if (fieldRole && fieldRole !== ConfigConstant.Role.Editor) {
      return false;
    }
    return true;
  });

  const rows = Selectors.getRangeRows(state, row, row + rowCount);
  return {
    datasheetId: state.pageParams.datasheetId!,
    columns,
    rows,
  };
}

function extendViewIfNeed(state: IReduxState, range: IRange, stdValueTable: IStandardValueTable, callback: (paste: boolean) => void) {
  const numberRange = Range.bindModel(range).toNumberBaseRange(state);
  if (!numberRange) {
    return;
  }
  const rowOverflow = !Selectors.isRowSpaceEnough(state, stdValueTable.body.length, numberRange.row);
  const colOverflow = !Selectors.isColumnSpaceEnough(state, stdValueTable.header.length, numberRange.column);
  const sheetPermission = Selectors.getPermissions(store.getState());
  if ((!rowOverflow && !colOverflow) || (colOverflow && !rowOverflow && !sheetPermission.fieldCreatable)) {
    callback(true);
    return;
  }

  function rightContent() {
    if (rowOverflow && colOverflow) {
      return t(Strings.paste_tip_for_add_record_field);
    }
    if (rowOverflow) {
      return t(Strings.paste_tip_for_add_record);
    }
    return t(Strings.paste_tip_add_field);
  }

  Modal.confirm({
    type: 'warning',
    title: t(Strings.paste),
    content: rightContent(),
    centered: true,
    okText: t(Strings.submit),
    cancelText: t(Strings.cancel),
    onCancel() {
      callback(false);
    },
    onOk() {
      callback(true);
    },
    okButtonProps: {
      color: 'primary',
    },
  });
}

/**
 * Check that the record is still all in the record in the property of the view after pasting
 * If not all are present, you need to indicate that the results have been filtered
 * @param {IGridView} pasteView
 * @param {IStandardValueTable} stdValueTable
 */
// function checkPasteNewRecordHasBeFilter(rows: IGridViewProperty, actions: { p: string[] }[]) {
//   // action.p[1] is setRecord action recordId
//   const actionRecordIds = actions.map(action => action.p[1]);
//   const visibleRecordIds = keyBy(rows, 'recordId');
//   const pasteRecordInTheVisible = filter(actionRecordIds, rId => Boolean(visibleRecordIds[rId]));
//   if (pasteRecordInTheVisible.length !== actionRecordIds.length) {
//     const filterCount = actionRecordIds.length - pasteRecordInTheVisible.length;
//     return filterCount;
//   }
//   return -1;
// }

interface ICopyCutMessageMap {
  [type: string]: {
    [unit: string]: {
      [selectMode: string]: (count: number) => string;
    };
  };
}

const copyCutToastMsgMap: ICopyCutMessageMap = {
  copy: {
    record: {
      single: () =>
        t(Strings.toast_copy_record_by_count, {
          count: 1,
        }),
      multiple: (count) =>
        t(Strings.toast_copy_record_by_count, {
          count,
        }),
    },
    cell: {
      single: () =>
        t(Strings.toast_copy_cell_by_count, {
          count: 1,
        }),
      multiple: (count) =>
        t(Strings.toast_copy_cell_by_count, {
          count,
        }),
    },
  },
  cut: {
    record: {
      single: () =>
        t(Strings.toast_cut_record_by_count, {
          count: 1,
        }),
      multiple: (count) =>
        t(Strings.toast_cut_record_by_count, {
          count,
        }),
    },
    cell: {
      single: () =>
        t(Strings.toast_cut_cell_by_count, {
          count: 1,
        }),
      multiple: (count) =>
        t(Strings.toast_cut_cell_by_count, {
          count,
        }),
    },
  },
};

function toastCopyCut({
  type,
  unit,
  select,
  count,
}: {
  type: 'copy' | 'cut';
  unit: 'record' | 'cell';
  select: 'single' | 'multiple';
  count: number;
}) {
  notify.open({ message: copyCutToastMsgMap[type][unit][select](count), key: NotifyKey.Paste });
}

export class Clipboard {
  constructor(
    private readonly commandManager: CollaCommandManager,
    private readonly uploadManager: UploadManager,
  ) {}

  cuttingRangeData?: {
    datasheetId: string;
    columns: IGridViewColumn[];
    rows: IViewRow[];
  };
  isCutting = false;

  selectWithWorkdocField(tableHeader?: IField[]) {
    const state = store.getState() as IReduxState;
    const selections = Selectors.getSelectRanges(state);
    const range = selections[0];
    const fillHandleCellIndex = Range.bindModel(range).getUIIndexRange(state);
    const { min: fieldMinIndex, max: fieldMaxIndex } = fillHandleCellIndex?.field || {
      min: null,
      max: null,
    };
    let _selectWithWorkdocField = false;
    if (fieldMaxIndex != null && !isNaN(fieldMaxIndex)) {
      // select section with workdoc field cannot be
      const visibleColumns = Selectors.getVisibleColumns(state);
      const fieldMap = Selectors.getFieldMap(state)!;
      if (tableHeader) {
        // paste
        // loop tableHeader to check if there is workdoc field
        _selectWithWorkdocField = tableHeader.some((field) => field.type === FieldType.WorkDoc);
      } else {
        // copy
        for (let idx = fieldMinIndex; idx <= fieldMaxIndex; idx++) {
          const { fieldId } = visibleColumns[idx];
          const field = fieldMap[fieldId];
          if (field.type === FieldType.WorkDoc) {
            _selectWithWorkdocField = true;
            break;
          }
        }
      }
    }
    return _selectWithWorkdocField;
  }

  paste(e: ClipboardEvent, ignoreEdit?: boolean) {
    const state = store.getState() as IReduxState;
    if (ShortcutContext.context.isEditing() && !ignoreEdit) {
      return;
    }

    const view = Selectors.getCurrentView(state);
    const selections = Selectors.getSelectRanges(state);
    // No paste target
    if (!view || ![ViewType.Grid, ViewType.Gantt].includes(view.type) || !selections) {
      return;
    }
    const selection = selections[0];

    const clipboardData = e.clipboardData;
    if (!clipboardData) {
      return;
    }

    this.interceptScreenShot(clipboardData);
    const parsers: { format: string; parser: ISerializer<IStandardValueTable | null, string> }[] = [
      { format: 'text/datasheet', parser: Serializer.json },
      { format: 'text/html', parser: Serializer.html },
      { format: 'text/plain', parser: Serializer.csv },
    ];

    let stdValueTable: IStandardValueTable | null = null;
    let clipboardText = '';
    for (let i = 0, ii = parsers.length; i < ii; i++) {
      const { parser, format } = parsers[i];
      const data = clipboardData.getData(format);
      if (data) {
        stdValueTable = parser.parse(data);
      }

      if (stdValueTable !== null) {
        clipboardText = data;
        break;
      }
    }

    if (stdValueTable === null) {
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();
    extendViewIfNeed(state, selection, stdValueTable, (paste) => {
      if (paste) {
        if (this.selectWithWorkdocField(stdValueTable?.header)) {
          Message.warning({
            content: t(Strings.selected_with_workdoc_no_copy),
          });
        }
        notify.open({ message: t(Strings.message_coping), key: NotifyKey.Paste });
        const pasteCellCount = stdValueTable!.body.length * (stdValueTable!.body[0]?.length || 0);
        setTimeout(
          async () => {
            const commandResult = (await this.executePaste(
              state,
              view as any,
              selection,
              stdValueTable!,
              clipboardText,
            )) as any as ICollaCommandExecuteResult<{}> & { isPasteIncompatibleField: boolean };
            this.clearCuttingStatus();
            if (commandResult.result === ExecuteResult.Fail) {
              notify.open({
                message: t(Strings.message_copy_failed, {
                  reason: commandResult.reason,
                }),
                key: NotifyKey.Paste,
              });
              console.warn('! ' + `Paste failed, reason: ${commandResult.reason}`);
            }

            if (commandResult.result === ExecuteResult.None) {
              if (commandResult.isPasteIncompatibleField) {
                notify.open({ message: t(Strings.message_copy_failed_reasoned_by_wrong_type), key: NotifyKey.Paste });
              } else {
                notify.open({ message: t(Strings.message_copy_succeed), key: NotifyKey.Paste });
              }
            }
            if (commandResult.result === ExecuteResult.Success) {
              notify.open({ message: t(Strings.message_copy_succeed), key: NotifyKey.Paste });
            }
          },
          pasteCellCount > 100 ? 100 : 0,
        ); // Delayed prompt when pasting more than 100 cells
      }
    });
  }

  async executePaste(
    state: IReduxState,
    pasteView: IGridViewProperty,
    pasteRange: IRange,
    stdValueTable: IStandardValueTable,
    clipboardText: string,
  ) {
    const viewId = pasteView.id;
    const { row, column } = Range.bindModel(pasteRange).toNumberBaseRange(state)!;
    const { id: datasheetId, snapshot } = Selectors.getDatasheet(state)!;
    const rows = Selectors.getVisibleRows(state);
    const groupFields = Selectors.getGroupFields(pasteView, Selectors.getFieldMap(state, state.pageParams.datasheetId!)!).map((f) => f.id);
    const recordValue = snapshot.recordMap[rows[row].recordId].data;
    const cellValues = groupFields.map((f) => (recordValue ? recordValue[f] : null));
    let isPasteIncompatibleField = false;
    let commandResult = this.commandManager.execute({
      cmd: CollaCommandName.PasteSetFields,
      viewId,
      column,
      fields: stdValueTable.header,
      stdValues: stdValueTable.body,
    });
    await this.updateMemberInfo(stdValueTable, pasteRange);

    if (commandResult.result !== ExecuteResult.Fail) {
      let isRealCutting: boolean = this.isCutting;
      if (this.isCutting && this.cuttingRangeData && stdValueTable.datasheetId === datasheetId) {
        const { viewId } = stdValueTable;
        const cuttingView = Selectors.getViewById(snapshot, viewId || '');
        if (cuttingView && cuttingView.type === ViewType.Grid) {
          isRealCutting = clipboardText === Serializer.json.serialize(stdValueTable);
        }
      }

      commandResult = this.commandManager.execute({
        cmd: CollaCommandName.PasteSetRecords,
        row,
        column,
        viewId,
        fields: stdValueTable.header,
        stdValues: stdValueTable.body,
        recordIds: stdValueTable.recordIds,
        cut: isRealCutting ? this.cuttingRangeData : undefined,
        groupCellValues: cellValues,
        notifyExistIncompatibleField: () => {
          isPasteIncompatibleField = true;
        },
      });
      recogClipboardURLData({
        state,
        row,
        column,
        stdValueTable,
        datasheetId,
        clipboardText,
      });
    }
    return { ...commandResult, isPasteIncompatibleField };
  }

  copyCut(e: ClipboardEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const state = store.getState() as IReduxState;
    let selections = Selectors.getSelectRanges(state);
    const selectRecordIds = Selectors.getSelectRecordIds(state);
    const selectRecordRanges = Selectors.getSelectionRecordRanges(state);
    let isCopyCutCheckedRecords = false;
    if (!selectRecordIds.length) {
      return;
    }
    // There are no selections. Only checkbox selected records
    if (!selections.length && selectRecordRanges) {
      isCopyCutCheckedRecords = true;
      selections = Range.selectRecord2Ranges(state, selectRecordRanges);
    }

    const stdValueTable = selections.reduce<IStandardValueTable>((pre, item) => {
      const stdValueTable = Selectors.getStdValueTableFromRange(state, item);
      if (!stdValueTable) {
        return pre;
      }

      const allowCopyDataToExternal = state.space.spaceFeatures?.allowCopyDataToExternal || state.share.allowCopyDataToExternal;
      const fieldPermissionMap = Selectors.getFieldPermissionMap(state);
      const noPermissionCopyFieldIndex: number[] = [];

      stdValueTable.header = stdValueTable.header.filter((field, index) => {
        const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, field.id);

        if (!allowCopyDataToExternal && fieldRole && fieldRole !== ConfigConstant.Role.Editor) {
          noPermissionCopyFieldIndex.push(index);
          return false;
        }

        return true;
      });

      if (!stdValueTable.header.length) {
        // 如果经过权限筛选后，选区内的所有列都没有权限 copy 数据，这里直接返回
        return pre;
      }

      let _body = stdValueTable.body;

      if (noPermissionCopyFieldIndex.length) {
        /**
         * 这里 stdValueTable.body 的数据格式为一个二维数组，
         * 第一个纬度是选区的每一行，
         * 第二个纬度是每一行中，选区从左往右对应每一列的单元格数据
         * 
         * 因此这里的逻辑就是删除第二层数组中，对应位置的数据
         */
        _body = _body.map((row) => {
          return row.filter((_, index) => !noPermissionCopyFieldIndex.includes(index));
        });
      }

      return {
        ...stdValueTable,
        body: pre.body ? [...pre.body, ..._body] : _body,
      };
    }, {} as IStandardValueTable);

    if (!Object.keys(stdValueTable).length) return;

    const text = Serializer.csv.serialize(stdValueTable);
    const ie = browser?.satisfies({ ie: '*' });
    let html = '';
    if (!ie) {
      html = Serializer.html.serialize(stdValueTable);
    }

    if (!text && !html) {
      return;
    }

    const clipboardData = e.clipboardData;
    clipboardData && clipboardData.setData('text/plain', text);
    if (!ie) {
      clipboardData && clipboardData.setData('text/html;charset=utf-8', html);
    }
    const jsonText = Serializer.json.serialize(stdValueTable);
    if (jsonText) {
      clipboardData && clipboardData.setData('text/datasheet', jsonText);
    }
    if (this.isCutting) {
      this.cuttingRangeData = selections.reduce<IGetCutRangeDataReturn>((pre, item) => {
        const result = getCutRangeData(state, item);
        if (Object.keys(pre).length === 0) {
          return result;
        }
        return {
          ...pre,
          rows: [...pre.rows, ...result.rows],
        };
      }, {} as IGetCutRangeDataReturn);
    }

    const range = selections[0];
    const selection = Range.bindModel(range).toNumberBaseRange(state)!;
    if (this.selectWithWorkdocField()) {
      return;
    }
    const isSelectRecord = isCopyCutCheckedRecords || selection.columnCount === Selectors.getVisibleColumns(state).length;
    const unit = isSelectRecord ? 'record' : 'cell';
    const { rowCount, columnCount } = selection;
    let select: 'single' | 'multiple';
    let count: number;
    if (isSelectRecord) {
      select = selections.length === 1 && selection.rowCount === 1 ? 'single' : 'multiple';
      count = selectRecordIds.length;
    } else {
      select = selection.rowCount === 1 && selection.columnCount === 1 ? 'single' : 'multiple';
      count = rowCount * columnCount;
    }
    toastCopyCut({ type: this.isCutting ? 'cut' : 'copy', unit, select, count });
  }

  copy(event: ClipboardEvent) {
    if (ShortcutContext.context.isEditing()) {
      return;
    }

    this.clearCuttingStatus();
    this.copyCut(event);
  }

  cut(event: ClipboardEvent) {
    if (ShortcutContext.context.isEditing()) {
      return;
    }

    this.clearCuttingStatus();
    this.isCutting = true;
    this.copyCut(event);
  }

  clearCuttingStatus() {
    this.isCutting = false;
    this.cuttingRangeData = undefined;
  }

  interceptScreenShot(clipboardData: DataTransfer | null) {
    if (!clipboardData) {
      return;
    }
    const activeCell = Selectors.getActiveCell(store.getState());
    if (!activeCell) {
      return;
    }
    const snapshot = Selectors.getSnapshot(store.getState());
    const fieldMap = snapshot!.meta.fieldMap;
    const { recordId, fieldId } = activeCell;
    const files = Array.from(clipboardData.files).filter((item) => {
      return isImage(item);
    });
    if (!files.length) {
      return;
    }
    if (fieldMap[fieldId].type !== FieldType.Attachment) {
      notify.open({
        message: t(Strings.paste_attachment_error),
        key: NotifyKey.Paste,
      });
      return;
    }
    const uploadManager = this.uploadManager;
    const cellValue = Selectors.getCellValue(store.getState(), snapshot!, recordId, fieldId) as IAttachmentValue[];
    const stdFileList = uploadManager.buildStdUploadList(files, recordId, fieldId, cellValue);
    const datasheetId = Selectors.getDatasheet(store.getState())!.id;
    stdFileList.forEach((item) => {
      uploadManager.register(
        UploadManager.getCellId(recordId, fieldId),
        uploadManager.generateSuccessFn(recordId, fieldId, { name: item.file.name, id: item.fileId }),
        UploadManager.generateFormData(item.file, datasheetId),
        item.fileId,
      );
    });
  }

  updateMemberInfo(stdValueTable: IStandardValueTable, pasteRange: IRange) {
    const { header, body } = stdValueTable;
    const state = store.getState();
    const { column, columnCount } = Range.bindModel(pasteRange).toNumberBaseRange(state)!;
    const isOnlyCopyOneCell = body.length === 1 && body[0].length === 1;
    const visibleColumns = Selectors.getVisibleColumns(state);
    const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!)!;
    const memberFieldIndex: number[] = [];
    const _columnCount = isOnlyCopyOneCell ? columnCount : header.length;
    visibleColumns.slice(column, column + _columnCount).forEach((column, index) => {
      if (fieldMap[column.fieldId].type !== FieldType.Member) {
        return;
      }
      memberFieldIndex.push(index);
    });
    if (memberFieldIndex.length === 0) {
      return;
    }
    const collectData: string[] = [];
    if (isOnlyCopyOneCell) {
      collectData.push(body[0][0].data[0].text);
    } else {
      body.forEach((item) => {
        item.forEach((stdValue, index) => {
          if (!memberFieldIndex.includes(index)) {
            return;
          }
          if (!stdValue.data[0]) {
            return;
          }
          collectData.push(stdValue.data[0].text);
        });
      });
    }
    if (!collectData.length) {
      return;
    }
    const linkId = Selectors.getLinkId(store.getState());
    return store.dispatch(StoreActions.loadLackUnitMap(collectData.join(','), linkId) as any);
  }
}
