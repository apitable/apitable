import {
  Field, IField, ISelectField, isSelectField,
  moveArrayElement, SelectField, Selectors, Strings, t,
} from '@vikadata/core';
import classNames from 'classnames';
import produce from 'immer';
import { Message } from 'pc/components/common';
import { OptionSetting } from 'pc/components/common/color_picker';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { usePrevious } from 'pc/components/common/hooks/use_previous';
import { Modal } from 'pc/components/common/mobile/modal';
import { useResponsive } from 'pc/hooks';
import { useThemeColors } from '@vikadata/components';
import { memo, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
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
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const isPreview = isSelectField(currentField) &&
    fieldMap[currentField.id] &&
    !isSelectField(fieldMap[currentField.id]);

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
        onOk: value => {
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
    const _currentField = produce(currentField, draft => {
      moveArrayElement(draft.property.options, source.index, destination?.index!);
      return draft;
    });
    setCurrentField({
      ..._currentField,
    });
  };

  const onChange = (type: OptionSetting, id: string, value: number | string) => {

    setCurrentField(preState => {
      const index = preState.property.options.findIndex(item => item.id === id);
      return produce(preState, draft => {
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
      {
        Boolean(isPreview && curOptsLen)
        && <div className={styles.preview}>{t(Strings.to_select_tip)}</div>
      }
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={currentField.id} direction="vertical">
          {provided => {
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
        <IconAdd width={15} height={15} fill={colors.thirdLevelText} />
        {t(Strings.add_an_option)}
      </div>
    </>
  );
};

export const FormatSelectMobile = memo(FormatSelectBase);
