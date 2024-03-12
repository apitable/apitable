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
import { omit } from 'lodash';
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { DragDropContext, DragUpdate, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { Divider, Typography, useThemeColors } from '@apitable/components';
import {
  Field,
  IField,
  ISelectField,
  ISelectFieldProperty,
  isSelectField,
  moveArrayElement,
  SelectField,
  Selectors,
  Strings,
  t,
  ThemeName,
} from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { OptionSetting } from 'pc/components/common/color_picker';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { FilterGeneralSelect } from 'pc/components/tool_bar/view_filter/filter_value/filter_general_select';
import { useAppSelector } from 'pc/store/react-redux';
import { createRainbowColorsArr } from 'pc/utils/color_utils';
import styles from '../styles.module.less';
import { FormatSelectItem } from './format_select_item';
import { FormatSelectMobile } from './mobile/format_select_mobile';

interface IFormatSelect {
  currentField: ISelectField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
  isMulti: boolean;
  datasheetId?: string;
}

const COLOR_COUNT = 51;

export function useColorColorWheel(theme: ThemeName) {
  const [baseColor, vipColor, whiteBgColor] = createRainbowColorsArr(theme);

  const ColorWheel: string[] = [...baseColor, ...vipColor, whiteBgColor];

  return ColorWheel;
}

export function setColor(index: number, theme: ThemeName) {
  const [baseColor, vipColor, whiteBgColor] = createRainbowColorsArr(theme);

  const ColorWheel: string[] = [...baseColor, ...vipColor, whiteBgColor];

  if (index < COLOR_COUNT) {
    return ColorWheel[index];
  }
  return ColorWheel[index % COLOR_COUNT];
}

interface ISortableContainerProps {
  onSortEnd: (result: DropResult, provided: ResponderProvided) => void;
  onDragUpdate?: (initial: DragUpdate, provided: ResponderProvided) => void;
}

const SortableContainer: React.FC<React.PropsWithChildren<ISortableContainerProps>> = ({ onDragUpdate, onSortEnd, children }) => {
  return (
    <DragDropContext onDragEnd={onSortEnd} onDragUpdate={onDragUpdate}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const FormatSelectBase = (props: IFormatSelect) => {
  const colors = useThemeColors();

  const { currentField, setCurrentField, isMulti, datasheetId } = props;
  const { options, defaultValue } = currentField.property;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, datasheetId || state.pageParams.datasheetId!))!;
  const isPreview = isSelectField(currentField) && fieldMap[currentField.id] && !isSelectField(fieldMap[currentField.id]);

  function addNewItem() {
    const newItem = (Field.bindModel(currentField) as SelectField).createNewOption('');
    if (!newItem) {
      return;
    }
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        options: [...options, newItem],
      },
    });
  }

  const onSortEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const oldIndex = result.source.index;
    const newIndex = result.destination.index;
    const _currentField = produce(currentField, (draft) => {
      moveArrayElement(draft.property.options, oldIndex, newIndex);
      return draft;
    });
    setCurrentField({
      ..._currentField,
    });
  };
  const selectColor = (optionIndex: number, color: number) => {
    setCurrentField((pre) => {
      return produce(pre, (draft) => {
        draft.property.options[optionIndex].color = color;
        return draft;
      });
    });
  };

  // Here there is an unused parameter because of the generic property setting method defined in ColorPiker
  const onOptionChange = (_type: OptionSetting, id: string, value: number | string) => {
    selectColor(
      options.findIndex((item) => item.id === id),
      value as number,
    );
  };

  const listStyle: React.CSSProperties = {};
  const btnStyle: React.CSSProperties = {};
  if (options.length === 0) {
    listStyle.minHeight = 0;
    listStyle.paddingTop = 0;
    btnStyle.marginTop = -8;
  }

  return (
    <>
      {Boolean(isPreview && options.length) && <div className={styles.preview}>{t(Strings.to_select_tip)}</div>}
      <div style={listStyle} className={classNames(styles.selection, styles.selectList)}>
        <SortableContainer onSortEnd={onSortEnd}>
          {options.map((item, index) => {
            return (
              <FormatSelectItem
                key={item.id}
                item={item}
                index={index}
                onOptionChange={onOptionChange}
                currentField={currentField}
                setCurrentField={setCurrentField}
                addNewItem={addNewItem}
              />
            );
          })}
        </SortableContainer>
      </div>
      <div style={btnStyle} className={styles.addNewItem} onClick={addNewItem}>
        <AddOutlined size={15} color={colors.thirdLevelText} />
        {t(Strings.add_an_option)}
      </div>
      {options.length > 0 && (
        <div className={styles.section}>
          <Divider className={styles.divider} />
          <Typography className={styles.defaultValueTitle} color={colors.fc3} variant="body3">
            {t(Strings.default_value)}
          </Typography>
          <FilterGeneralSelect
            popupClass={styles.selectDefault}
            placeholder={t(Strings.placeholder_add_record_default_complete)}
            searchPlaceholder={t(Strings.find)}
            field={currentField}
            isMulti={isMulti}
            onChange={(val) => {
              const property: ISelectFieldProperty = val
                ? {
                  ...currentField.property,
                  defaultValue: val,
                }
                : omit(currentField.property, 'defaultValue');
              setCurrentField({
                ...currentField,
                property,
              });
            }}
            cellValue={defaultValue}
            listData={options.filter((option) => Boolean(option.name.trim()))}
          />
        </div>
      )}
    </>
  );
};

export const FormatSelect: React.FC<React.PropsWithChildren<IFormatSelect>> = (props) => {
  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <FormatSelectBase {...props} />
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <FormatSelectMobile {...props} />
      </ComponentDisplay>
    </>
  );
};
