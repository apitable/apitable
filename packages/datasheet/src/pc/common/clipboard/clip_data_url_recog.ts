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

import { isEmpty } from 'lodash';
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

import { Message } from 'pc/components/common/message/message';
import { resourceService } from 'pc/resource_service';
import { IURLMeta } from 'pc/utils/url_recognition';

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

// Accessing clipboard data and determining whether to URL-identify it
export const recogClipboardURLData = ({ state, row, column, stdValueTable, datasheetId, clipboardText }: IRecogClipboardURLDataProps): void => {
  const visibleColumns = Selectors.getVisibleColumns(state);
  const fieldMap = Selectors.getFieldMap(state, state.pageParams.datasheetId!)!;

  // No copy selection, but external clipboard content is not empty, directly judged and recognised
  if (!stdValueTable.recordIds?.length && clipboardText) {
    const activeCell = Selectors.getActiveCell(state, datasheetId);
    if (!activeCell) return;

    const { recordId, fieldId } = activeCell;

    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (!snapshot) return;

    const cellValue: ICellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);

    if (fieldMap[fieldId]?.type === FieldType.URL && fieldMap[fieldId]?.property?.isRecogURLFlag) {
      if (!isUrl(clipboardText)) return;

      Api.getURLMetaBatch([clipboardText]).then((res) => {
        if (res?.data?.success) {
          const metaMap: IURLMetaMap = res.data.data.contents;
          const meta = metaMap[clipboardText];

          if (!meta?.isAware) {
            Message.warning({
              content: t(Strings.url_recog_failure_message),
            });

            return;
          }

          let opData = [
            {
              text: clipboardText,
              link: clipboardText,
              type: SegmentType.Url,
              favicon: meta?.favicon,
              title: meta?.title,
            },
          ];

          if (Array.isArray(cellValue)) {
            opData = cellValue.map((v) => ({
              ...(v as any),
              type: SegmentType.Url,
              title: meta?.title,
              favicon: meta?.favicon,
            }));
          }

          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetRecords,
            datasheetId,
            data: [
              {
                fieldId,
                recordId,
                value: opData as IHyperlinkSegment[],
              },
            ],
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

  // Determine if there are columns in the copy target area with URL recognition enabled
  const targetFieldsWithURLRecogFlag = visibleColumns
    .slice(column, column + stdValueTable.header.length)
    .map((col, index) => ({ ...col, index }))
    .filter((field) => fieldMap[field.fieldId]?.type === FieldType.URL && fieldMap[field.fieldId]?.property?.isRecogURLFlag);

  // The target area does not have URL recognition columns turned on do not operate
  if (!targetFieldsWithURLRecogFlag.length) return;

  // Need to identify more than 100 cells without operation
  if (
    !stdValueTable.recordIds?.length ||
    targetFieldsWithURLRecogFlag.length * stdValueTable.recordIds.length > ConfigConstant.MAX_URL_COPY_RECOG_NUM
  )
    return;

  const visibleRows = Selectors.getVisibleRows(state);
  const targetRows = visibleRows.slice(row, row + stdValueTable.recordIds.length).map((row, index) => ({ ...row, index }));

  // Calculate the value of the target area that should be pasted
  const targetMatrix = targetRows.reduce((acc: any, row: IViewRow & { index: number }) => {
    const cells = targetFieldsWithURLRecogFlag.map((field) => ({
      recordId: row.recordId,
      fieldId: field.fieldId,
      data: stdValueTable.body[row.index][field.index].data as ICellValue,
    }));

    return [...acc, ...cells];
  }, []);

  const urlsToBeRecog = targetMatrix
    .filter((record) => record.data.length <= 1)
    .map((record) => record.data[0]?.text || '')
    .filter((text) => isUrl(text));

  const urls2Title = targetMatrix.filter((record) => record.data.length <= 1 && record.data[0]?.title).map((record) => record.data[0]?.title);

  if (!isEmpty(urls2Title)) {
    return;
  }

  Api.getURLMetaBatch(urlsToBeRecog).then((res) => {
    if (res?.data?.success) {
      const metaMap: IURLMetaMap = res.data.data.contents;

      const generateOpValue = (data: any) => {
        if (data.length > 1) return data;

        const text = data[0]?.text;
        if (!isUrl(text)) return data;

        const meta = metaMap[text];

        if (!meta?.isAware) return data;

        return data.map((v: any) => ({
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
