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

import { useMount } from 'ahooks';
import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import * as React from 'react';
import { IAttachmentValue, RowHeightLevel, IAttacheField } from '@apitable/core';
import { FocusHolder } from 'pc/components/editors/focus_holder';
import { UploadCore, UploadCoreSize } from 'pc/components/upload_modal/upload_core';
import { IExpandFieldEditRef } from '../field_editor/field_editor';

interface IExpandAttachmentBaseProps {
  datasheetId: string;
  recordId: string;
  field: IAttacheField;
  onClick: (e: React.MouseEvent) => void;
  editable: boolean;
  cellValue: IAttachmentValue[];
  rowHeightLevel?: RowHeightLevel;
  keyPrefix?: string;
  onSave?: (cellValue: IAttachmentValue[]) => void;
  getCellValueFn?: (datasheetId: string | undefined, recordId: string, fieldId: string) => IAttachmentValue[];
}

export const ExpandAttachContext = React.createContext<{ isFocus?: boolean }>({});

export const ExpandAttachmentBase: React.ForwardRefRenderFunction<IExpandFieldEditRef, IExpandAttachmentBaseProps> = (props, ref) => {
  useImperativeHandle(
    ref,
    (): IExpandFieldEditRef => ({
      focus: () => {
        editorRef.current && editorRef.current.focus();
        return;
      },
      setValue: () => {
        return;
      },
      saveValue: () => {
        return;
      },
    }),
  );

  const firstRender = useRef(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const { recordId, field, datasheetId, editable, cellValue, onSave, getCellValueFn } = props;

  useMount(() => {
    firstRender.current = true;
  });

  return (
    <>
      <UploadCore
        recordId={recordId}
        field={field}
        datasheetId={datasheetId}
        cellValue={cellValue}
        columnCount={4}
        zoneStyle={{ padding: 0 }}
        readonly={!editable}
        size={UploadCoreSize.Normal}
        onSave={onSave}
        getCellValueFn={getCellValueFn}
        className="uploadTabWrapper"
      />
      {/* The state of focus conflicts with the dragging behaviour of the attachment, so it is
      only positioned on initial load, after which focus is no longer triggered */}
      {!firstRender.current && (
        <div style={{ height: '0px' }}>
          <FocusHolder ref={editorRef} />
        </div>
      )}
    </>
  );
};

export const ExpandAttachment = memo(forwardRef(ExpandAttachmentBase));
