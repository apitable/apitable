import { useClickAway } from 'ahooks';
import { Input } from 'antd';
import produce from 'immer';
import { ColorPicker, OptionSetting } from 'pc/components/common/color_picker';
import { CellOptions } from 'pc/components/multi_grid/cell/cell_options';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { IHeadOptionProps } from 'pc/components/kanban_view/group_header/group_head_menu';
import styles from './styles.module.less';
import { useThemeColors } from '@vikadata/components';

export const OptionFieldHead: React.FC<IHeadOptionProps> = props => {
  const colors = useThemeColors();
  const { cellValue, field, editing, setEditing, onCommand, isAdd, readOnly } = props;
  const [fieldClone, setFieldClone] = useState(field);
  const editAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<Input>(null);
  useEffect(() => {
    setFieldClone(field);
  }, [field]);

  const optionItem = fieldClone.property.options.find(item => item.id === cellValue)!;

  function onOptionChange(type: OptionSetting, id: string, value: string | number) {
    if (type !== OptionSetting.SETCOLOR) {
      return;
    }
    const newField = produce(fieldClone, draft => {
      draft.property.options.map(item => {
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
    const value = inputRef.current!.input.value;
    if (!value.length) {
      setEditing(false);
      return;
    }
    const optionId = cellValue;
    const newField = produce(fieldClone, draft => {
      draft.property.options = draft.property.options.map(item => {
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
