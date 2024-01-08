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

import * as React from 'react';
import { Box } from '@apitable/components';
import {
  CollaCommandName,
  FieldType,
  IAttacheField,
  IAttachmentValue,
  ICellValue,
  IDateTimeField,
  IField,
  IHyperlinkSegment,
  ILinkField,
  ILinkIds,
  IRecord,
  IRecordAlarmClient,
  isUrl,
  SegmentType,
  Selectors,
  StoreActions,
  ViewType,
} from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { ButtonFieldItem } from 'pc/components/editors/button_editor/buton_item';
import { CheckboxEditor } from 'pc/components/editors/checkbox_editor';
import { FocusHolder } from 'pc/components/editors/focus_holder';
import { IEditor } from 'pc/components/editors/interface';
import { RatingEditor } from 'pc/components/editors/rating_editor';
import { autoTaskScheduling } from 'pc/components/gantt_view/utils/auto_task_line_layout';
import { CellAutoNumber } from 'pc/components/multi_grid/cell/cell_auto_number';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { IURLMeta, recognizeURLAndSetTitle } from 'pc/utils';
import { dispatch } from 'pc/worker/store';
import { EnhanceTextEditor } from '../../editors/enhance_text_editor';

// Editors
import { TextEditor } from '../../editors/text_editor';
import { CellCreatedBy } from '../../multi_grid/cell/cell_created_by';
import { CellCreatedTime } from '../../multi_grid/cell/cell_created_time';
import { ExpandAttachContext, ExpandAttachment } from '../expand_attachment';
import { ExpandCascader } from '../expand_cascader';
import { ExpandDateTimeEditor } from '../expand_date_time_editor';
import { ExpandFormula } from '../expand_formula';
import { ExpandLink } from '../expand_link';
import { ExpandLookUp } from '../expand_lookup';
import { ExpandNumber } from '../expand_number';
import { ExpandSelect } from '../expand_select';
import { ExpandWorkdoc } from '../expand_work_doc';
// @ts-ignore
import { convertAlarmStructure } from 'enterprise/alarm/date_time_alarm/utils';

export interface ICommonProps {
  style: React.CSSProperties;
  datasheetId: string;
  mirrorId?: string;
  editable: boolean;
  record: IRecord;
  field: IField;
  height: number;
  width: number;
  editing: true;
  ref: React.MutableRefObject<IEditor>;
}

export interface IFieldBlockProps {
  commonProps: ICommonProps;
  cellValue: ICellValue;
  isFocus: boolean;
  onMouseDown(e: React.MouseEvent): void;
  showAlarm?: boolean;
}

export const FieldBlock: React.FC<React.PropsWithChildren<IFieldBlockProps>> = (props) => {
  const { commonProps: _commonProps, cellValue, isFocus, onMouseDown, showAlarm } = props;

  const { datasheetId, mirrorId, field, record, ref: editorRef } = _commonProps;

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const mobileEditorWidth: React.CSSProperties = isMobile ? { width: '100%' } : {};

  const state = store.getState();
  const activeView = useAppSelector((state) => Selectors.getCurrentView(state));
  const visibleRows = useAppSelector((state) => Selectors.getVisibleRows(state));

  const onSave = (value: ICellValue, curAlarm?: Omit<IRecordAlarmClient, 'id'>) => {
    const isUrlWithRecogURLFlag = field.type === FieldType.URL && field.property?.isRecogURLFlag && Array.isArray(value);

    const urlTextNoChange = isUrlWithRecogURLFlag && cellValue?.[0].text === (value[0] as any)?.text;

    if (!urlTextNoChange) {
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetRecords,
        datasheetId,
        alarm: convertAlarmStructure?.(curAlarm as IRecordAlarmClient),
        data: [
          {
            recordId: record!.id,
            fieldId: field.id,
            value,
          },
        ],
        mirrorId,
      });
    }

    if (isUrlWithRecogURLFlag) {
      const _value = value as IHyperlinkSegment[];
      const url = _value.reduce((acc: string, cur: IHyperlinkSegment) => (cur.text || '') + acc, '');

      const callback = (meta: IURLMeta) => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetRecords,
          datasheetId,
          data: [
            {
              recordId: record.id,
              fieldId: field.id,
              value: value.map((v) => ({
                ...(v as any),
                type: SegmentType.Url,
                title: meta?.title,
                favicon: meta?.favicon,
              })),
            },
          ],
        });
      };

      if (isUrl(url) && cellValue?.[0]?.text !== (value[0] as any)?.text) {
        recognizeURLAndSetTitle({
          url,
          callback,
        });
      }
    }
    if (activeView && activeView.type === ViewType.Gantt) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { linkFieldId, endFieldId } = activeView?.style;
      if (!(linkFieldId && endFieldId === field.id)) return;
      const sourceRecordData = {
        recordId: record!.id,
        endTime: value as number | null,
      };
      const commandDataArr = autoTaskScheduling(visibleRows, activeView.style, sourceRecordData);
      resourceService.instance?.commandManager.execute({
        cmd: CollaCommandName.SetRecords,
        data: commandDataArr,
      });
    }
  };

  const commonProps = {
    ..._commonProps,
    onSave,
  };

  const FocusHolderWrapper = (
    <div style={{ height: 0, width: 0 }}>
      <FocusHolder ref={editorRef} />
    </div>
  );

  switch (field.type) {
    case FieldType.SingleSelect:
    case FieldType.MultiSelect:
    case FieldType.Member:
      const unitMap = Selectors.getUnitMap(state);
      const linkId = Selectors.getLinkId(state);
      return (
        <ExpandSelect
          {...commonProps}
          linkId={linkId}
          unitMap={unitMap}
          cellValue={cellValue}
          isFocus={isFocus}
          recordId={record.id}
          isMemberField={field.type === FieldType.Member}
          style={mobileEditorWidth}
        />
      );
    case FieldType.Text:
    case FieldType.SingleText:
      return <TextEditor {...commonProps} minRows={4} />;
    case FieldType.URL:
    case FieldType.Email:
    case FieldType.Phone:
      return <EnhanceTextEditor recordId={record.id} {...commonProps} cellValue={cellValue} />;
    case FieldType.Number:
    case FieldType.Currency:
    case FieldType.Percent:
      return <ExpandNumber isFocus={isFocus} cellValue={cellValue as number} {...commonProps} />;
    case FieldType.Rating:
      return <RatingEditor {...commonProps} style={mobileEditorWidth} />;
    case FieldType.Checkbox:
      return (
        <CheckboxEditor {...commonProps} cellValue={cellValue as boolean} style={{ paddingLeft: 9, justifyContent: 'flex-start', height: 32 }} />
      );
    case FieldType.DateTime:
      return (
        <ExpandDateTimeEditor
          commonProps={{
            ...commonProps,
            recordId: record.id,
            field: field as IDateTimeField,
          }}
          ref={editorRef}
          isFocus={isFocus}
          cellValue={cellValue}
          showAlarm={showAlarm}
        />
      );
    case FieldType.Attachment:
      return (
        <ExpandAttachContext.Provider value={{ isFocus }}>
          <ExpandAttachment
            {...commonProps}
            field={field as IAttacheField}
            recordId={record.id}
            cellValue={cellValue as IAttachmentValue[]}
            onClick={onMouseDown}
            onSave={(cellValue) => {
              dispatch(StoreActions.setPreviewFileCellActive(cellValue));
              commonProps.onSave(cellValue);
            }}
          />
        </ExpandAttachContext.Provider>
      );
    case FieldType.Link:
    case FieldType.OneWayLink:
      return (
        <ExpandLink
          {...commonProps}
          recordId={record.id}
          field={commonProps.field as ILinkField}
          onClick={onMouseDown}
          cellValue={cellValue as ILinkIds}
          style={mobileEditorWidth}
        />
      );
    case FieldType.LookUp:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ref, ...restProps } = commonProps;
      return (
        <>
          <ExpandLookUp recordId={record.id} {...restProps} field={field} />
          {FocusHolderWrapper}
        </>
      );
    case FieldType.Formula:
      return (
        <>
          <ExpandFormula {...commonProps} recordId={commonProps.record.id} />
          {FocusHolderWrapper}
        </>
      );
    case FieldType.AutoNumber:
      return (
        <>
          <CellAutoNumber field={field} cellValue={cellValue} isFromExpand />
          {FocusHolderWrapper}
        </>
      );
    case FieldType.CreatedTime:
    case FieldType.LastModifiedTime:
      return (
        <>
          <CellCreatedTime field={field} cellValue={cellValue} isFromExpand />
          {FocusHolderWrapper}
        </>
      );
    case FieldType.CreatedBy:
    case FieldType.LastModifiedBy:
      return (
        <>
          <CellCreatedBy field={field} cellValue={cellValue} isFromExpand />
          {FocusHolderWrapper}
        </>
      );
    case FieldType.Cascader:
      return (
        <ExpandCascader {...commonProps} isFocus={isFocus} cellValue={cellValue} field={commonProps.field as ILinkField} style={mobileEditorWidth} />
      );
    case FieldType.Button:
      return (
        <Box paddingLeft={'10px'} height={'22px'}>
          <ButtonFieldItem recordId={record.id} field={field} record={record} />
        </Box>
      );
    case FieldType.WorkDoc:
      return <ExpandWorkdoc {...commonProps} cellValue={cellValue} datasheetId={datasheetId} recordId={record.id} />;
    default:
      return <div />;
  }
};
