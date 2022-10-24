import {
  FieldType,
  Selectors,
  IReduxState,
  IStandardValueTable,
  ConfigConstant,
  IViewRow,
  ICellValue,
  isUrl,
  Api,
  SegmentType,
  CollaCommandName,
  t,
  Strings,
  IHyperlinkSegment,
} from '@apitable/core';

import { resourceService } from 'pc/resource_service';
import { Message } from 'pc/components/common';
import { IURLMeta } from 'pc/utils';

interface IRecogClipboardURLDataProps {
  state: IReduxState;
  row: number;
  column: number;
  stdValueTable: IStandardValueTable;
  datasheetId: string;
  clipboardText: string;
}

interface IURLMetaMap {
  [key: string]: IURLMeta;
}

// 访问clipboard数据并判断是否要对其进行URL识别
export const recogClipboardURLData = ({ state, row, column, stdValueTable, datasheetId, clipboardText }: IRecogClipboardURLDataProps): void => {
  const visibleColumns = Selectors.getVisibleColumns(state);
  const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!)!;

  // 没有复制选区，但外部剪贴板内容不为空，直接判断并识别
  if (!stdValueTable.recordIds?.length && clipboardText) {
    const activeCell = Selectors.getActiveCell(state, datasheetId);
    if (!activeCell) return;

    const { recordId, fieldId } = activeCell;

    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (!snapshot) return;

    const cellValue: ICellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);

    if (fieldMap[fieldId]?.type === FieldType.URL && fieldMap[fieldId]?.property?.isRecogURLFlag) {
      if (!isUrl(clipboardText)) return;

      Api.getURLMetaBatch([clipboardText]).then(res => {
        if (res?.data?.success) {
          const metaMap: IURLMetaMap = res.data.data.contents;
          const meta = metaMap[clipboardText];

          if (!meta?.isAware) {
            Message.warning({
              content: t(Strings.url_recog_failure_message),
            });

            return;
          }

          let opData = [{
            text: clipboardText,
            link: clipboardText,
            type: SegmentType.Url,
            favicon: meta?.favicon,
            title: meta?.title,
          }];

          if (Array.isArray(cellValue)) {
            opData = cellValue.map(v => ({
              ...v,
              type: SegmentType.Url,
              title: meta?.title,
              favicon: meta?.favicon,
            }));
          }

          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetRecords,
            datasheetId,
            data: [{
              fieldId,
              recordId,
              value: opData as IHyperlinkSegment[],
            }],
          });
        } else {
          Message.error({
            content: res.data.message,
          });
        }
      });
    }

    return;
  }

  // 判断复制目标区域有无开启了URL识别的列
  const targetFieldsWithURLRecogFlag = visibleColumns
    .slice(column, column + stdValueTable.header.length)
    .map((col, index) => ({ ...col, index }))
    .filter(field => fieldMap[field.fieldId]?.type === FieldType.URL && fieldMap[field.fieldId]?.property?.isRecogURLFlag);

  // 目标区域没有开启URL识别列不操作
  if (!targetFieldsWithURLRecogFlag.length) return;

  // 需要识别超过100个单元格不操作
  if (!stdValueTable.recordIds?.length
    || targetFieldsWithURLRecogFlag.length * stdValueTable.recordIds.length > ConfigConstant.MAX_URL_COPY_RECOG_NUM
  ) return;

  const visibleRows = Selectors.getVisibleRows(state);
  const targetRows = visibleRows
    .slice(row, row + stdValueTable.recordIds.length)
    .map((row, index) => ({ ...row, index }));

  // 计算目标区域应该被paste的值
  const targetMatrix = targetRows.reduce((acc: any, row: IViewRow & { index: number }) => {
    const cells = targetFieldsWithURLRecogFlag.map(field => ({
      recordId: row.recordId,
      fieldId: field.fieldId,
      data: stdValueTable.body[row.index][field.index].data as ICellValue,
    }));

    return [...acc, ...cells];
  }, []);

  const urlsToBeRecog = targetMatrix
    .filter(record => record.data.length <= 1)
    .map(record => record.data[0]?.text || '')
    .filter(text => isUrl(text));

  Api.getURLMetaBatch(urlsToBeRecog).then(res => {
    if (res?.data?.success) {
      const metaMap: IURLMetaMap = res.data.data.contents;

      const generateOpValue = (data) => {
        if (data.length > 1) return data;

        const text = data[0]?.text;
        if (!isUrl(text)) return data;

        const meta = metaMap[text];

        if (!meta?.isAware) return data;

        return data.map(v => ({
          ...v,
          type: SegmentType.Url,
          title: meta?.title,
          favicon: meta?.favicon,
        }));
      };

      if (Object.values(metaMap).some((meta: IURLMeta) => !meta?.isAware)) {
        Message.warning({
          content: t(Strings.url_batch_recog_failure_message),
        });
      }

      const opData = targetMatrix.map((target) => ({
        recordId: target.recordId,
        fieldId: target.fieldId,
        value: generateOpValue(target.data),
      }));

      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetRecords,
        datasheetId,
        data: opData,
      });
    } else {
      Message.error({
        content: res.data.message,
      });
    }
  });
};
