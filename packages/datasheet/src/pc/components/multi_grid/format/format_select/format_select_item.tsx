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

import { Input } from 'antd';
import classNames from 'classnames';
import produce from 'immer';
import * as React from 'react';
import { useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useThemeColors } from '@apitable/components';
import { IField, ISelectField, ISelectFieldOption } from '@apitable/core';
import { DeleteOutlined, DragOutlined } from '@apitable/icons';
import { ColorPicker, OptionSetting } from 'pc/components/common/color_picker';
import { stopPropagation } from 'pc/utils';
import styles from '../styles.module.less';

export interface IFormatSelectItem {
  item: ISelectFieldOption;
  index: number;
  onOptionChange: (type: OptionSetting, id: string, value: number | string) => void;
  currentField: ISelectField;
  setCurrentField: React.Dispatch<React.SetStateAction<IField>>;
  addNewItem: () => void;
}

export const FormatSelectItem: React.FC<React.PropsWithChildren<IFormatSelectItem>> = (props) => {
  const { item, index, onOptionChange, currentField, setCurrentField, addNewItem } = props;
  const colorPickerRef = useRef(null);
  const isTypingRef = useRef(false);
  const colors = useThemeColors();
  const onChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 100 && value.length > item.name.length) {
      return;
    }
    setCurrentField((pre) => {
      return produce(pre, (draft) => {
        draft.property.options[index].name = value;
        return draft;
      });
    });
  };

  const deleteItem = (index: number) => {
    setCurrentField((pre) => {
      // When deleting a single multi-select option, the deleted option used in defaultValue is immediately cleared
      const curOption = currentField.property.options[index];
      let defaultValue = currentField.property.defaultValue;
      if (Array.isArray(defaultValue) && defaultValue.some((dv) => dv === curOption.id)) {
        defaultValue = defaultValue.filter((dv) => dv !== curOption.id);
      } else if (typeof defaultValue === 'string' && defaultValue === curOption.id) {
        defaultValue = undefined;
      }
      const nextState = produce(pre, (draft) => {
        draft.property.options.splice(index, 1);
        draft.property.defaultValue = defaultValue;
        return draft;
      });

      return nextState;
    });
  };

  const pressEnter = (e: React.KeyboardEvent) => {
    if (isTypingRef.current) return;
    (e.target as HTMLInputElement).blur();
    addNewItem();
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={styles.selectionItem}>
          <div
            className={classNames(styles.iconMove, {
              [styles.dragging]: snapshot.isDragging,
            })}
            {...provided.dragHandleProps}
          >
            <DragOutlined size={16} color={colors.thirdLevelText} />
          </div>
          <div onClick={stopPropagation} ref={colorPickerRef}>
            <ColorPicker onChange={onOptionChange} option={item} mask />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              size={'small'}
              onChange={onChange.bind(null, index)}
              value={item.name}
              autoFocus={index === currentField.property.options.length - 1}
              onPressEnter={pressEnter}
              onCompositionStart={() => (isTypingRef.current = true)}
              onCompositionEnd={() => (isTypingRef.current = false)}
            />
          </div>
          <div className={styles.iconDelete} onClick={deleteItem.bind(null, index)}>
            <DeleteOutlined size={16} color={colors.fourthLevelText} />
          </div>
        </div>
      )}
    </Draggable>
  );
};
