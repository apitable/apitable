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

import { forwardRef, useImperativeHandle, useRef, memo } from 'react';
import * as React from 'react';
import { IAttacheField, IAttachmentValue } from '@apitable/core';
import { UploadModal } from 'pc/components/upload_modal';
import { FocusHolder } from '../focus_holder';
import { IEditor } from '../interface';
import { IEditorProps } from '../options_editor';

interface IAttachmentEditorProps {
  cellValue: IAttachmentValue[];
  recordId: string;
  editable: boolean;
}

export const AttachmentEditorBase: React.ForwardRefRenderFunction<IEditor, IEditorProps & IAttachmentEditorProps> = (props, ref) => {
  const { recordId, field, editing, datasheetId, cellValue, onSave } = props;
  const inputRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: () => {
        inputRef.current && inputRef.current.focus();
      },
      onEndEdit: () => {
        return;
      },
      onStartEdit: () => {
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

  return (
    <>
      {/* The input here is just to keep it in focus so that the record can be expanded when the shortKey is space */}
      <FocusHolder ref={inputRef} />
      {editing && !props.disabled && (
        <UploadModal field={field as IAttacheField} recordId={recordId} datasheetId={datasheetId} cellValue={cellValue} onSave={onSave} />
      )}
    </>
  );
};

export const AttachmentEditor = memo(forwardRef(AttachmentEditorBase));
