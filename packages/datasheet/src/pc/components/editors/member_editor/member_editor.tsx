import { FieldType, ICellValue, IMemberField, IUnitIds, IUnitMap, IUnitValue, IUserValue, IUuids } from '@vikadata/core';
import classNames from 'classnames';
import { MemberOptionList } from 'pc/components/list/member_option_list';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import * as React from 'react';
import { useFocusEffect } from '../hooks/use_focus_effect';
import { IBaseEditorProps, IEditor } from '../interface';
import { PopStructure } from '../pop_structure';
import styles from './styles.module.less';

export interface IEditorProps extends IBaseEditorProps {
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  cellValue: ICellValue;
  unitMap: IUnitMap | null;
  commandFn?: (memberValues: IUnitIds | IUuids) => void;
  linkId?: string;
  isMulti?: boolean;
  initMemberList?: (IUnitValue | IUserValue)[];
  initCellValue?: string[];
  isFilter?: boolean;
  toggleEditing?: (next?: boolean) => void;
  recordId?: string;
  listData?: (IUnitValue | IUserValue)[];
}

export const MemberEditorBase: React.ForwardRefRenderFunction<IEditor, IEditorProps> = (props, ref) => {
  useImperativeHandle(ref, (): IEditor => ({
    focus: (preventScroll: boolean) => { inputRef.current && inputRef.current!.focus({ preventScroll: preventScroll }); },
    onEndEdit: () => { return; },
    onStartEdit: () => { return; },
    setValue: () => { return; },
    saveValue: () => { return; },
  }));

  const {
    datasheetId, field, style, height, editing, width, isMulti: propIsMulti,
    toggleEditing, cellValue, onSave, unitMap, linkId, recordId, listData,
  } = props;

  const isMemberField: boolean = field.type === FieldType.Member;
  const isMulti = propIsMulti || (field as IMemberField).property.isMulti;
  const inputRef = useRef<HTMLInputElement>(null);

  const onClose = () => {
    toggleEditing && toggleEditing();
  };

  function command(value: IUnitIds | IUuids) {
    const tempVal = (value as IUnitIds).length ? value : null;
    !isMulti && toggleEditing && toggleEditing();
    onSave && onSave(tempVal);
  }
  useFocusEffect(() => {
    if (editing) {
      setTimeout(() => {
        inputRef.current?.focus();
      },0);
    }
  }, [editing]);
  return (
    <PopStructure
      style={style}
      width={width}
      height={height}
      editing={editing}
      className={classNames({ [styles.memberEditor]: true })}
      onClose={onClose}
    >
      <MemberOptionList
        sourceId={datasheetId}
        linkId={linkId}
        unitMap={unitMap}
        showSearchInput
        showMoreTipButton
        onClickItem={command}
        multiMode={isMulti}
        existValues={cellValue as IUnitIds | IUuids | null}
        listData={listData}
        uniqId={isMemberField ? 'unitId' : 'userId'}
        inputRef={inputRef}
        monitorId={`${recordId},${field?.id},${editing}`}
      />

    </PopStructure>
  );
};
export const MemberEditor = React.memo(forwardRef(MemberEditorBase));
