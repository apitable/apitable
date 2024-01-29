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

import { useClickAway } from 'ahooks';
import classNames from 'classnames';
import { useImperativeHandle, useRef, useState, useMemo, useLayoutEffect, useEffect } from 'react';
import * as React from 'react';
import { ICellValue, Selectors } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { IBaseEditorProps, IEditor } from 'pc/components/editors/interface';
import { MemberEditor } from 'pc/components/editors/member_editor/member_editor';
import { IExpandFieldEditRef } from 'pc/components/expand_record/field_editor';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { printableKey, KeyCode } from 'pc/utils';
import { CellMember } from './cell_member';
import styles from './style.module.less';

export interface IMemberFieldEditorProps extends IBaseEditorProps {
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  isFocus: boolean;
  cellValue: ICellValue;
  onClose?: (...args: any) => void;
}

export const MemberFieldEditor: React.FC<React.PropsWithChildren<IMemberFieldEditorProps>> = React.forwardRef((props, ref) => {
  const { field, cellValue, editable, isFocus, onSave, onClose } = props;
  const editorRef = useRef<IEditor>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editing, _setEditing] = useState(false);
  const [height, setHeight] = useState(0);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const unitMap = useAppSelector((state) => Selectors.getUnitMap(state));
  const { shareId } = useAppSelector((state) => state.pageParams);

  const setEditing = (status: boolean) => {
    if (!editable) {
      return;
    }
    _setEditing(status);
    if (isMobile) {
      return;
    }
    editorRef.current?.focus();
  };

  useEffect(() => {
    if (!editing && onClose) {
      onClose();
    }
    // eslint-disable-next-line
  }, [editing]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.clientHeight);
    }
  }, [editing, cellValue]);

  useClickAway(
    () => {
      if (isMobile) {
        return;
      }
      editing && isFocus && setEditing(false);
    },
    containerRef,
    'mousedown',
  );

  useMemo(() => {
    if (!isFocus) {
      setEditing(false);
    }
    // eslint-disable-next-line
  }, [isFocus]);

  useImperativeHandle(ref, (): IExpandFieldEditRef => {
    const editor = editorRef.current;
    if (!editor) {
      return {
        focus: () => {
          return;
        },
        setValue: () => {
          return;
        },
        saveValue: () => {
          return;
        },
      };
    }

    return {
      focus: editor.focus,
      setValue: editor.setValue,
      saveValue: () => {
        return;
      },
    };
  });

  const setEditingByKeyDown = (event: React.KeyboardEvent) => {
    if (editing) {
      return;
    }
    const { metaKey, ctrlKey } = event;
    if (metaKey || ctrlKey) {
      return;
    }
    if (printableKey(event.nativeEvent)) {
      setEditing(true);
    }
    if (event.keyCode === KeyCode.Esc) {
      setEditing(false);
    }
  };

  const onChange = (cellValue: any) => {
    onSave && onSave(cellValue);
  };

  const commonCellStyle = { height: 40, alignItems: 'center', alignContent: 'center', cursor: 'pointer' };

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div onKeyDown={setEditingByKeyDown} ref={containerRef}>
          <div onClick={() => setEditing(!editing)}>
            <CellMember
              field={field}
              cellValue={cellValue}
              unitMap={unitMap}
              isActive
              onChange={onChange}
              readonly={!editable}
              style={commonCellStyle}
            />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            {editing && (
              <MemberEditor
                ref={editorRef}
                {...props}
                unitMap={unitMap}
                height={height || 0}
                editing={editing}
                linkId={shareId}
                toggleEditing={() => setEditing(!editing)}
                style={{
                  width: editing && editable ? 160 : 0,
                  overflow: editing && editable ? '' : 'hidden',
                  zIndex: 1000,
                }}
              />
            )}
          </div>
        </div>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={classNames(styles.displayBox, styles.option)} onClick={() => editable && setEditing(!editing)} ref={containerRef}>
          <CellMember
            field={field}
            cellValue={cellValue}
            unitMap={unitMap}
            readonly={!editable}
            isActive
            deletable={false}
            style={commonCellStyle}
            onChange={onChange}
          />
        </div>
        {editing && (
          <MemberEditor ref={editorRef} {...props} unitMap={unitMap} editing={editing} linkId={shareId} toggleEditing={() => setEditing(false)} />
        )}
      </ComponentDisplay>
    </>
  );
});
