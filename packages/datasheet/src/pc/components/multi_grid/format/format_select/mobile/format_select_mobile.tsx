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
import produce from 'immer';
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useThemeColors } from '@apitable/components';
import { Field, IField, ISelectField, isSelectField, moveArrayElement, SelectField, Selectors, Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common';
import { OptionSetting } from 'pc/components/common/color_picker';
import { ScreenSize } from 'pc/components/common/component_display';
import { usePrevious } from 'pc/components/common/hooks/use_previous';
import { Modal } from 'pc/components/common/mobile/modal';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import styles from '../../styles.module.less';
import { FormatSelectItem } from './format_select_item';

interface IFormatSelect {
  currentField: ISelectField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

const FormatSelectBase = (props: IFormatSelect) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const { currentField, setCurrentField } = props;
  const fieldMap = useAppSelector((state) => {
    const { formId, datasheetId } = state.pageParams;
    if (formId) {
      const sourceInfo = Selectors.getForm(state, formId)?.sourceInfo;
      if (!sourceInfo) return {};
      const { datasheetId } = sourceInfo;
      return Selectors.getFieldMap(state, datasheetId);
    }
    return Selectors.getFieldMap(state, datasheetId!);
  })!;
  const isPreview = isSelectField(currentField) && fieldMap[currentField.id] && !isSelectField(fieldMap[currentField.id]);

  function addNewItem() {
    const newItem = (Field.bindModel(currentField) as SelectField).createNewOption('');
    if (!newItem) {
      return;
    }
    setCurrentField({
      ...currentField,
      property: {
        options: [...currentField.property.options, newItem],
      },
    });
    if (isMobile) {
      Modal.prompt({
        title: t(Strings.add_an_option),
        defaultValue: newItem.name,
        onOk: (value) => {
          if (value.length > 100) {
            Message.error({
              content: t(Strings.name_length_err),
            });
            return;
          }
          onChange(OptionSetting.RENAME, newItem.id, value);
        },
      });
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    setDraggingId(null);
    const _currentField = produce(currentField, (draft) => {
      moveArrayElement(draft.property.options, source.index, destination?.index!);
      return draft;
    });
    setCurrentField({
      ..._currentField,
    });
  };

  const onChange = (type: OptionSetting, id: string, value: number | string) => {
    setCurrentField((preState) => {
      const index = preState.property.options.findIndex((item: { id: string }) => item.id === id);
      return produce(preState, (draft) => {
        switch (type) {
          case OptionSetting.SETCOLOR: {
            draft.property.options[index].color = value;
            return draft;
          }

          case OptionSetting.RENAME: {
            const newName = value as string;
            const oldName = preState.property.options[index]?.name;
            if (newName.length > 100 || oldName === newName) {
              return;
            }
            draft.property.options[index].name = newName;
            return draft;
          }

          case OptionSetting.DELETE: {
            draft.property.options.splice(index, 1);
            return draft;
          }

          default: {
            return draft;
          }
        }
      });
    });
  };

  const curOptsLen = currentField.property.options.length;
  const prevOptsLen = usePrevious(curOptsLen);

  useEffect(() => {
    if (curOptsLen > prevOptsLen!) {
      const container = document.querySelector(`.${styles.selection}`) as HTMLDivElement;
      if (!container) {
        return;
      }
      container.scrollTop = container.scrollHeight;
    }
  }, [curOptsLen, prevOptsLen]);

  return (
    <>
      {Boolean(isPreview && curOptsLen) && <div className={styles.preview}>{t(Strings.to_select_tip)}</div>}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={currentField.id} direction="vertical">
          {(provided) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={classNames(styles.selection, {
                  [styles.dragStart]: draggingId,
                })}
              >
                {currentField.property.options.map((option, index) => {
                  return (
                    <FormatSelectItem
                      key={option.id}
                      option={option}
                      index={index}
                      draggingId={draggingId}
                      setDraggingId={setDraggingId}
                      optionsLength={curOptsLen}
                      addNewItem={addNewItem}
                      onChange={onChange}
                    />
                  );
                })}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>

      <div className={styles.addNewItem} onClick={addNewItem}>
        <AddOutlined size={15} color={colors.thirdLevelText} />
        {t(Strings.add_an_option)}
      </div>
    </>
  );
};

export const FormatSelectMobile = memo(FormatSelectBase);
