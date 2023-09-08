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

import classNames from 'classnames';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import * as React from 'react';
import { FieldType, ICellValue, IMemberField, IUnitIds, IUnitMap, IUnitValue, IUserValue, IUuids } from '@apitable/core';
import { MemberOptionList } from 'pc/components/list/member_option_list';
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
  useImperativeHandle(
    ref,
    (): IEditor => ({
      focus: (preventScroll: boolean) => {
        inputRef.current && inputRef.current!.focus({ preventScroll: preventScroll });
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

  const {
    datasheetId,
    field,
    style,
    height,
    editing,
    width,
    isMulti: propIsMulti,
    toggleEditing,
    cellValue,
    onSave,
    unitMap,
    linkId,
    recordId,
    listData,
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
      }, 0);
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
        multiMode={Boolean(isMulti)}
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
