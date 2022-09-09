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
} from '@vikadata/core';
import { produce } from 'immer';
import { ScreenSize } from 'pc/components/common/component_display';
import { OptionList } from 'pc/components/list';
import { resourceService } from 'pc/resource_service';
import { useResponsive } from 'pc/hooks';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { IBaseEditorProps, IEditor } from '../interface';
import { PopStructure } from '../pop_structure';
import styles from './style.module.less';
import { useFocusEffect } from '../hooks/use_focus_effect';

export interface IEditorProps extends IBaseEditorProps {
  style: React.CSSProperties;
  editing: boolean;
  recordId: string;
  toggleEditing?: (next?: boolean) => void;
}

export enum ErrorType {
  Repeat = 'Repeat',
  Illegal = 'Illegal',
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
  const { fieldPropertyEditable } = useSelector(state => Selectors.getPermissions(state, datasheetId));
  const cellValue = useSelector((state: IReduxState) => {
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    return Selectors.getCellValue(state, snapshot!, recordId, field.id);
  });
  const currentFieldInfo = useSelector(state => Selectors.getField(state, field.id, datasheetId));
  // 这里计算出来的 isMulti 事实上是 field.isMulti 与 isFiltering  的并集, 在 Filtering（筛选) 状态, `单选 + 包含` 也当成多选处理
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

  // 这个状态用来维护拖拽时拖拽按钮的显示
  const [draggingId, setDraggingId] = useState<string | undefined>();

  function afterDrag(trulyOldIndex, trulyNewIndex) {
    setCurrentField(field => {
      return produce(field, draft => {
        moveArrayElement(draft.property.options, trulyOldIndex, trulyNewIndex);
        return draft;
      });
    });
  }

  // 创建一个新的选项
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
        listData={Number(style.width) === 0 ? [] : options}
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
