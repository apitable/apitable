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
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { ISelectFieldOption } from '@apitable/core';
import { CloseOutlined, DragOutlined } from '@apitable/icons';
import { ColorPicker, OptionSetting } from 'pc/components/common/color_picker';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { stopPropagation } from 'pc/utils';
import styles from '../../styles.module.less';

export interface IFormatSelectItem {
  option: ISelectFieldOption;
  index: number;
  draggingId: string | null;
  optionsLength: number;
  setDraggingId: React.Dispatch<React.SetStateAction<string | null>>;
  addNewItem(): void;
  onChange(type: OptionSetting, id: string, value: number | string): void;
}

const FormatSelectItemBase: React.FC<React.PropsWithChildren<IFormatSelectItem>> = (props) => {
  const { option, index, draggingId, optionsLength, setDraggingId, addNewItem, onChange } = props;
  const colors = useThemeColors();
  const pressEnter = (e: React.KeyboardEvent) => {
    (e.target as HTMLInputElement).blur();
    addNewItem();
  };

  const onDrag = (e: React.SyntheticEvent<Element, Event>) => {
    stopPropagation(e);
    setDraggingId(option.id);
  };

  const onDrop = (e: React.SyntheticEvent<Element, Event>) => {
    stopPropagation(e);
    setDraggingId(null);
  };

  const DraggableChild = (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div
          className={classNames(styles.iconMove, {
            [styles.dragging]: draggingId === option.id,
          })}
          onMouseDown={onDrag}
          onMouseUp={onDrop}
        >
          <DragOutlined size={14} />
        </div>
        <ColorPicker onChange={onChange} option={option} mask />
        <div style={{ flex: 1 }}>
          <Input
            size="small"
            onChange={(e) => onChange(OptionSetting.RENAME, option.id, e.target.value)}
            value={option.name}
            onPressEnter={pressEnter}
            autoFocus={index === optionsLength - 1}
          />
        </div>
        <div className={styles.iconDelete} onClick={() => onChange(OptionSetting.DELETE, option.id, '')}>
          <CloseOutlined size={15} color={colors.thirdLevelText} />
        </div>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={styles.item}>
          <div
            className={classNames(styles.iconMove, {
              [styles.dragging]: draggingId === option.id,
            })}
            onTouchStart={onDrag}
            onTouchEnd={onDrop}
          >
            <DragOutlined size={14} />
          </div>
          <ColorPicker onChange={onChange} option={option} showRenameInput mask />
          <div className={styles.optName}>{option.name}</div>
        </div>
      </ComponentDisplay>
    </>
  );

  return (
    <Draggable draggableId={option.id} index={index} key={option.id}>
      {(provided) => (
        <div className={styles.selectionItem} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {DraggableChild}
        </div>
      )}
    </Draggable>
  );
};

const areEqual = (
  prevProps: Readonly<React.PropsWithChildren<IFormatSelectItem>>,
  nextProps: Readonly<React.PropsWithChildren<IFormatSelectItem>>,
) => {
  const { option: prevOption, index: prevIndex } = prevProps;
  const { option: nextOption, index: nextIndex } = nextProps;

  return shallowEqual(prevOption, nextOption) && shallowEqual(prevIndex, nextIndex);
};

export const FormatSelectItem = React.memo(FormatSelectItemBase, areEqual);
