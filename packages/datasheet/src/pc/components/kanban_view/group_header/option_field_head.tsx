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
import type { InputRef } from 'antd';
import { Input } from 'antd';
import produce from 'immer';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useThemeColors } from '@apitable/components';
import { ColorPicker, OptionSetting } from 'pc/components/common/color_picker';
import { CellOptions } from 'pc/components/multi_grid/cell/cell_options';
import { IHeadOptionProps } from './interface';
import styles from './styles.module.less';

export const OptionFieldHead: React.FC<React.PropsWithChildren<IHeadOptionProps>> = (props) => {
  const colors = useThemeColors();
  const { cellValue, field, editing, setEditing, onCommand, isAdd, readOnly } = props;
  const [fieldClone, setFieldClone] = useState(field);
  const editAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);
  useEffect(() => {
    setFieldClone(field);
  }, [field]);

  const optionItem = fieldClone.property.options.find((item) => item.id === cellValue)!;

  function onOptionChange(type: OptionSetting, id: string, value: string | number) {
    if (type !== OptionSetting.SETCOLOR) {
      return;
    }
    const newField = produce(fieldClone, (draft) => {
      draft.property.options.map((item) => {
        if (id === item.id) {
          item.color = value as number;
        }
        return item;
      });
      return draft;
    });
    setFieldClone(newField);
  }

  function onDoubleClick() {
    if (editing || readOnly) {
      return;
    }
    setEditing(true);
  }

  function onPressEnter() {
    if (!inputRef.current) {
      return;
    }
    const value = inputRef.current!.input?.value;
    if (!value?.length) {
      setEditing(false);
      return;
    }
    const optionId = cellValue;
    const newField = produce(fieldClone, (draft) => {
      draft.property.options = draft.property.options.map((item) => {
        if (item.id !== optionId) return item;
        item.name = value;
        return item;
      });
      return draft;
    });
    onCommand(newField);
    return;
  }

  useClickAway(
    () => {
      onPressEnter();
    },
    editAreaRef,
    'mousedown',
  );

  if (!optionItem) {
    return <></>;
  }

  return (
    <div onClick={onDoubleClick} style={{ padding: isAdd ? '0px 16px' : '0 8px 0 0', overflow: 'hidden' }}>
      {editing ? (
        <div className={styles.optionEditArea} ref={editAreaRef}>
          <ColorPicker onChange={onOptionChange} option={optionItem} />
          <Input
            ref={inputRef}
            size={'small'}
            defaultValue={optionItem.name}
            onPressEnter={onPressEnter}
            autoFocus
            style={{ marginLeft: 4, background: colors.defaultBg }}
          />
        </div>
      ) : (
        <CellOptions cellValue={cellValue} field={field} className={styles.optionHeader} />
      )}
    </div>
  );
};
