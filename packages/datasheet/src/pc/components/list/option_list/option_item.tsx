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
import { produce } from 'immer';
import * as React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { useThemeColors } from '@apitable/components';
import { ExecuteResult, ICollaCommandExecuteResult, IFieldProperty, ISelectFieldOption, Strings, t, IField } from '@apitable/core';
import { DragOutlined } from '@apitable/icons';
import { ColorPicker, OptionSetting } from 'pc/components/common/color_picker';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { stopPropagation } from 'pc/utils';
import { OptionTag } from './option_tag';
import styles from './style.module.less';

interface IOptionItem {
  curOption: ISelectFieldOption;
  fieldEditable: boolean;
  getRealIndexOfOptions?: (id: string) => number;
  setCurrentField?: (getNewField: (newField: IFieldProperty) => IFieldProperty) => ICollaCommandExecuteResult<{}>;
  className?: string;
  dragOption?: {
    draggingId: string | undefined;
    setDraggingId: React.Dispatch<React.SetStateAction<string | undefined>>;
  };
}

const OptionItemBase: React.FC<React.PropsWithChildren<IOptionItem>> = (props) => {
  const { curOption, getRealIndexOfOptions, setCurrentField, dragOption, fieldEditable } = props;
  const colors = useThemeColors();
  const deleteItem = (optionId: string): ICollaCommandExecuteResult<{}> => {
    const trulyIndex = getRealIndexOfOptions && getRealIndexOfOptions(optionId);
    return setCurrentField!((field) => {
      return produce(field, (draft: IField) => {
        draft.property.options.splice(trulyIndex, 1);
        return draft;
      });
    });
  };

  const setOptionProperty = (optionIndex: number, propertyName: string, newValue: number | string): ICollaCommandExecuteResult<{}> => {
    return setCurrentField!((field) => {
      return produce(field, (draft: IField) => {
        draft.property.options[optionIndex][propertyName] = newValue;
        return draft;
      });
    });
  };

  const onOptionChange = (type: OptionSetting, id: string, value: string | number) => {
    if (!getRealIndexOfOptions) {
      return;
    }
    switch (type) {
      case OptionSetting.DELETE: {
        const result = deleteItem(value as string);
        if (result && ExecuteResult.Success === result.result) {
          notifyWithUndo(t(Strings.toast_delete_option_success), NotifyKey.DeleteOption);
        }
        break;
      }
      case OptionSetting.RENAME: {
        const result = setOptionProperty(getRealIndexOfOptions(id), 'name', value);
        if (ExecuteResult.Success === result.result) {
          notifyWithUndo(t(Strings.toast_change_option_success), NotifyKey.ChangeOptionName);
        }
        break;
      }
      case OptionSetting.SETCOLOR:
      default: {
        setOptionProperty(getRealIndexOfOptions(id), 'color', value);
        break;
      }
    }
  };

  const onDragHandleMouseDown = (e: React.MouseEvent) => {
    stopPropagation(e);
    dragOption && dragOption.setDraggingId!(curOption.id);
  };

  const onDragHandleMouseUp = (e: React.MouseEvent) => {
    stopPropagation(e);
    dragOption && dragOption.setDraggingId!(undefined);
  };

  const DragHandle = SortableHandle(() => (
    <div
      className={classNames(styles.iconMove, {
        [styles.dragging]: dragOption && dragOption.draggingId === curOption.id,
      })}
      onMouseDown={onDragHandleMouseDown}
      onMouseUp={onDragHandleMouseUp}
    >
      <DragOutlined size={10} color={colors.thirdLevelText} />
    </div>
  ));

  const showPickerAndDragBtn = fieldEditable && dragOption;

  return (
    <div className={styles.displayListItem}>
      {showPickerAndDragBtn && <DragHandle />}

      <div className={styles.colorReview}>
        {showPickerAndDragBtn && (
          <div className={styles.pickerAdapter}>
            <ColorPicker showRenameInput onChange={onOptionChange} option={curOption} mask />
          </div>
        )}
        <OptionTag option={curOption} />
      </div>
    </div>
  );
};

export const OptionItem = React.memo(OptionItemBase);
