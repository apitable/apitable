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

import { produce } from 'immer';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';
import {
  CollaCommandName,
  ExecuteResult,
  Field,
  FieldType,
  ICollaCommandExecuteResult,
  IFieldProperty,
  IReduxState,
  ISelectField,
  ISelectFieldOption,
  moveArrayElement,
  SelectField,
  Selectors,
  IField,
} from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { OptionList } from 'pc/components/list';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { useFocusEffect } from '../hooks/use_focus_effect';
import { IBaseEditorProps, IEditor } from '../interface';
import { PopStructure } from '../pop_structure';
import styles from './style.module.less';

export interface IEditorProps extends IBaseEditorProps {
  style?: React.CSSProperties;
  editing: boolean;
  recordId: string;
  editable: boolean;
  toggleEditing?: (next?: boolean) => void;
}

export const OptionsEditorBase: React.ForwardRefRenderFunction<IEditor, IEditorProps> = (props, ref) => {
  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: (preventScroll?: boolean) => {
        inputRef.current && inputRef.current!.focus({ preventScroll: preventScroll });
      },
      onEndEdit: () => {},
      onStartEdit: () => {
        return;
      },
      setValue: () => {
        return;
      },
      saveValue: () => {},
    }),
  );
  const { field, recordId, style, datasheetId, height, width, editing, toggleEditing, onSave } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldPropertyEditable } = useAppSelector((state) => Selectors.getPermissions(state, datasheetId));
  const cellValue = useAppSelector((state: IReduxState) => {
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    return Selectors.getCellValue(state, snapshot!, recordId, field.id);
  });
  const currentFieldInfo = useAppSelector((state) => Selectors.getField(state, field.id, datasheetId));
  const isMulti = FieldType.MultiSelect === field.type;

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const onClose = () => {
    toggleEditing && toggleEditing();
  };

  function command(value: string[] | string | null) {
    !isMulti && onClose();
    onSave && onSave(value);
    if (isMobile) {
      return;
    }
    inputRef.current && inputRef.current!.focus();
  }

  const setCurrentField = (getNewField: (newField: IFieldProperty) => IFieldProperty): ICollaCommandExecuteResult<{}> => {
    const newField = getNewField(field);

    return resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetFieldAttr,
      datasheetId,
      fieldId: field.id,
      data: newField,
    });
  };

  const [draggingId, setDraggingId] = useState<string | undefined>();

  function afterDrag(trulyOldIndex: number, trulyNewIndex: number) {
    setCurrentField((field) => {
      return produce(field, (draft: IField) => {
        moveArrayElement(draft.property.options, trulyOldIndex, trulyNewIndex);
        return draft;
      });
    });
  }

  function insertNewItem(keyword: string, cb: () => void) {
    if (!fieldPropertyEditable) {
      return;
    }
    if (!keyword || !keyword.trim().length) {
      return;
    }
    cb();
    const fieldMethod = Field.bindModel(field) as SelectField;
    const newItem = fieldMethod.createNewOption(keyword);
    const { result } = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetFieldAttr,
      datasheetId,
      fieldId: field.id,
      data: {
        ...(currentFieldInfo as ISelectField),
        property: {
          options: [...currentFieldInfo.property.options, newItem],
        },
      },
    });
    if (ExecuteResult.Success === result) {
      let newValue;
      if (!Array.isArray(cellValue) && typeof cellValue !== 'string') {
        newValue = [];
      } else {
        newValue = cellValue;
      }
      command(isMulti ? [...newValue, newItem!.id] : newItem!.id);
    }
  }

  const options: ISelectFieldOption[] = field.property.options;

  useFocusEffect(() => {
    if (editing) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [editing]);

  return (
    <PopStructure style={style} height={height} editing={editing} className={styles.optionsEditor} width={width} onClose={onClose}>
      <OptionList
        listData={Number(style?.width) === 0 ? [] : options}
        onAddHandle={fieldPropertyEditable ? insertNewItem : undefined}
        setCurrentField={setCurrentField}
        existValues={cellValue}
        datasheetId={datasheetId}
        onClickItem={command}
        multiMode={isMulti}
        dragOption={
          fieldPropertyEditable
            ? {
              afterDrag: afterDrag,
              draggingId: draggingId,
              setDraggingId: setDraggingId,
            }
            : undefined
        }
        inputRef={inputRef}
        monitorId={`${recordId},${field.id},${editing}`}
      />
    </PopStructure>
  );
};
export const OptionsEditor = React.memo(forwardRef(OptionsEditorBase));
