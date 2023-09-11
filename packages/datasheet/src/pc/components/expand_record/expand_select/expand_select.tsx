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
import RcTrigger from 'rc-trigger';
import { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { CollaCommandName, ICellValue, IMemberField, IUnitMap } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { IBaseEditorProps, IEditor } from 'pc/components/editors/interface';
import { MemberEditor } from 'pc/components/editors/member_editor/member_editor';
import { OptionsEditor } from 'pc/components/editors/options_editor';
import { CellMember } from 'pc/components/multi_grid/cell/cell_member';
import { CellOptions } from 'pc/components/multi_grid/cell/cell_options';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { KeyCode, printableKey, stopPropagation } from 'pc/utils';
import { IExpandFieldEditRef } from '../field_editor';
import styles from '../style.module.less';

export interface IExpandSelectProps extends IBaseEditorProps {
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  onClose?: (...args: any) => void;
  isFocus: boolean;
  cellValue: ICellValue;
  unitMap: IUnitMap | null;
  recordId: string;
  linkId?: string;
  isMemberField?: boolean;
}

export const ExpandSelect: React.FC<React.PropsWithChildren<IExpandSelectProps>> = React.forwardRef((props, selfRef) => {
  const { linkId, unitMap, recordId, onChange: _onChange, onClose, ...commonProps } = props;
  const { field, cellValue, editable, datasheetId, isFocus, isMemberField } = commonProps;
  const editorRef = useRef<IEditor>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editing, _setEditing] = useState(false);
  const [height, setHeight] = useState(0);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const setEditing = (status: boolean) => {
    if (!editable) {
      return;
    }
    _setEditing(status);
    if (isMobile) {
      return;
    }
    editorRef.current?.focus(true);
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

  useImperativeHandle(selfRef, (): IExpandFieldEditRef => {
    const editor = editorRef.current;
    const noop = () => {
      return;
    };
    if (!editor) {
      return {
        focus: noop,
        setValue: noop,
        saveValue: noop,
      };
    }

    return {
      focus: editor.focus,
      setValue: editor.setValue,
      saveValue: noop,
    };
  });

  function onChange(value: ICellValue) {
    if (_onChange) {
      _onChange(value);
      return;
    }
    editable &&
      resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.SetRecords,
        datasheetId,
        data: [
          {
            recordId: recordId,
            fieldId: field.id,
            value,
          },
        ],
      });
  }

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

  const Cell = isMemberField ? CellMember : CellOptions;
  const CellEditor = isMemberField ? MemberEditor : OptionsEditor;

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div onKeyDown={setEditingByKeyDown} ref={containerRef} className={styles.expandSelectContainer}>
          <RcTrigger
            action="click"
            popup={
              <div onMouseDown={stopPropagation} className={styles.isolationBox}>
                <CellEditor
                  ref={editorRef}
                  linkId={linkId}
                  unitMap={unitMap}
                  recordId={recordId}
                  {...commonProps}
                  height={height || 0}
                  editing={editing}
                  toggleEditing={() => setEditing(!editing)}
                  style={{
                    width: editing && editable ? 160 : 0,
                    overflow: editing && editable ? '' : 'hidden',
                    zIndex: 2000,
                  }}
                />
              </div>
            }
            destroyPopupOnHide
            popupAlign={{
              points: ['tl', 'bl'],
              offset: [0, 5],
              overflow: { adjustX: true, adjustY: true },
            }}
            popupStyle={{
              width: 200,
            }}
            popupVisible={editing}
            mask
          >
            <div onClick={() => setEditing(!editing)}>
              <Cell
                field={field as IMemberField}
                cellValue={cellValue}
                isActive
                onChange={onChange}
                readonly={!editable}
                className={styles.pointer}
              />
            </div>
          </RcTrigger>
        </div>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={classNames(styles.displayBox, styles.option)} onClick={() => editable && setEditing(!editing)} ref={containerRef}>
          <Cell cellValue={cellValue} field={field as IMemberField} isActive deletable={false} readonly={!editable} className={styles.pointer} />
        </div>
        {editing && (
          <CellEditor
            ref={editorRef}
            linkId={linkId}
            recordId={recordId}
            unitMap={unitMap}
            {...commonProps}
            editing={editing}
            toggleEditing={() => setEditing(false)}
          />
        )}
      </ComponentDisplay>
    </>
  );
});
