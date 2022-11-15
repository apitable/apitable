import { IField, ISelectField, ISelectFieldOption } from '@apitable/core';
import { Input } from 'antd';
import classNames from 'classnames';
import produce from 'immer';
import { ColorPicker, OptionSetting } from 'pc/components/common/color_picker';
import { useThemeColors } from '@apitable/components';
import { stopPropagation } from 'pc/utils';
import { useRef } from 'react';
import * as React from 'react';
import { SortableElement as sortableElement, SortableHandle as sortableHandle } from 'react-sortable-hoc';
import IconDelete from 'static/icon/common/common_icon_delete.svg';
import styles from '../styles.module.less';
import { DragOutlined } from '@apitable/icons';

export interface IFormatSelectItem {
  item: ISelectFieldOption;
  index: number;
  onOptionChange: (type: OptionSetting, id: string, value: number | string) => void;
  draggingId: string | undefined;
  setDraggingId: React.Dispatch<React.SetStateAction<string | undefined>>;
  currentField: ISelectField;
  setCurrentField: React.Dispatch<React.SetStateAction<IField>>;
  addNewItem: () => void;
}

export const SortableItem = sortableElement(({ children }) => <>{children}</>);

export const FormatSelectItem: React.FC<IFormatSelectItem> = props => {
  const { item, index, onOptionChange, draggingId, setDraggingId, currentField, setCurrentField, addNewItem } = props;
  const colorPickerRef = useRef(null);
  const colors = useThemeColors();
  const onChange = (index, e) => {
    const value = e.target.value;
    if (value.length > 100 && value.length > item.name.length) {
      return;
    }
    setCurrentField(pre => {
      return produce(pre, draft => {
        draft.property.options[index].name = value;
        return draft;
      });
    });
  };

  const deleteItem = (index: number) => {
    setCurrentField(pre => {
      // When deleting a single multi-select option, the deleted option used in defaultValue is immediately cleared
      const curOption = currentField.property.options[index];
      let defaultValue = currentField.property.defaultValue;
      if (Array.isArray(defaultValue) && defaultValue.some(dv => dv === curOption.id)) {
        defaultValue = defaultValue.filter(dv => dv !== curOption.id);
      } else if (typeof defaultValue === 'string' && defaultValue === curOption.id) {
        defaultValue = undefined;
      }
      const nextState = produce(pre, draft => {
        draft.property.options.splice(index, 1);
        draft.property.defaultValue = defaultValue;
        return draft;
      });

      return nextState;
    });
  };

  const pressEnter = (e: React.KeyboardEvent) => {
    (e.target as HTMLInputElement).blur();
    addNewItem();
  };

  const onDragHandleMouseDown = (e: React.MouseEvent) => {
    stopPropagation(e);
    setDraggingId(item.id);
  };

  const onDragHandleMouseUp = (e: React.MouseEvent) => {
    stopPropagation(e);
    setDraggingId(undefined);
  };

  const DragHandle = sortableHandle(() => (
    <div
      className={classNames(styles.iconMove, {
        [styles.dragging]: draggingId === item.id,
      })}
      onMouseDown={onDragHandleMouseDown}
      onMouseUp={onDragHandleMouseUp}
    >
      <DragOutlined size={10} color={colors.thirdLevelText} />
    </div>
  ));

  return (
    <SortableItem index={index}>
      <div className={styles.selectionItem}>
        <DragHandle />
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
          />
        </div>
        <div className={styles.iconDelete} onClick={deleteItem.bind(null, index)}>
          <IconDelete width={15} height={15} fill={colors.fourthLevelText} />
        </div>
      </div>
    </SortableItem>
  );
};
