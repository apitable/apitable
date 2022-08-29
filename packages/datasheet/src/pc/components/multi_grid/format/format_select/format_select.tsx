import { Typography, Divider, useThemeColors } from '@vikadata/components';
import {
  Field, IField, ISelectField, ISelectFieldProperty, isSelectField,
  moveArrayElement, SelectField, Selectors, Strings, t, ThemeName,
} from '@vikadata/core';
import produce from 'immer';
import { OptionSetting } from 'pc/components/common/color_picker/color_picker';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display/component_display';
import { createRainbowColorsArr } from 'pc/utils/color_utils';
import { Dispatch, SetStateAction, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  SortableContainer as sortableContainer,
} from 'react-sortable-hoc';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import styles from '../styles.module.less';
import { FormatSelectItem } from './format_select_item';
import { FormatSelectMobile } from './mobile/format_select_mobile';
import { FilterGeneralSelect } from 'pc/components/tool_bar/view_filter/filter_value/filter_general_select';
import { omit } from 'lodash';
import classNames from 'classnames';

interface IFormatSelect {
  currentField: ISelectField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
  isMulti: boolean;
  datasheetId?: string;
}

const COLOR_COUNT = 50;

export function setColor(index: number, theme: ThemeName) {
  const [baseColor, vipColor] = createRainbowColorsArr(theme);

  const ColorWheel: string[] = [
    ...baseColor,
    ...vipColor,
  ];
  
  if (index < COLOR_COUNT) {
    return ColorWheel[index];
  }
  return ColorWheel[index % COLOR_COUNT];
}

export const SortableContainer = sortableContainer(({ children }) => {
  return <div className={styles.sortableContainer}>{children}</div>;
});

const FormatSelectBase = (props: IFormatSelect) => {
  const [draggingId, setDraggingId] = useState<string | undefined>();
  const colors = useThemeColors();

  const { currentField, setCurrentField, isMulti, datasheetId } = props;
  const { options, defaultValue } = currentField.property;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, datasheetId || state.pageParams.datasheetId!))!;
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
        ...currentField.property,
        options: [...options, newItem],
      },
    });
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setDraggingId(undefined);
    const _currentField = produce(currentField, draft => {
      moveArrayElement(draft.property.options, oldIndex, newIndex);
      return draft;
    });
    setCurrentField({
      ..._currentField,
    });
  };
  const selectColor = (optionIndex: number, color: number) => {
    setCurrentField(pre => {
      return produce(pre, draft => {
        draft.property.options[optionIndex].color = color;
        return draft;
      });
    });
  };

  // 这里因为在 ColorPiker 里定义了通用的属性设置方法, 所以有个 unused 参数
  const onOptionChange = (type: OptionSetting, id: string, value: number | string) => {
    selectColor(options.findIndex(item => item.id === id), value as number);
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
      {
        Boolean(isPreview && options.length)
        && <div className={styles.preview}>{t(Strings.to_select_tip)}</div>
      }
      <div style={listStyle} className={classNames(styles.selection, styles.selectList)}>
        <SortableContainer useDragHandle onSortEnd={onSortEnd} distance={5}>
          {options.map((item, index) => {
            return (
              <FormatSelectItem
                key={item.id}
                item={item}
                index={index}
                onOptionChange={onOptionChange}
                draggingId={draggingId}
                setDraggingId={setDraggingId}
                currentField={currentField}
                setCurrentField={setCurrentField}
                addNewItem={addNewItem}
              />
            );
          })}
        </SortableContainer>
      </div>
      <div style={btnStyle} className={styles.addNewItem} onClick={addNewItem}>
        <IconAdd width={15} height={15} fill={colors.thirdLevelText} />
        {t(Strings.add_an_option)}
      </div>
      {options.length > 0 && (
        <div className={styles.section}>
          <Divider className={styles.divider}/>
          <Typography className={styles.defaultValueTitle} color={colors.fc3} variant="body3">{t(Strings.default_value)}</Typography>
          <FilterGeneralSelect
            popupClass={styles.selectDefault}
            placeholder={t(Strings.placeholder_add_record_default_complete)}
            searchPlaceholder={t(Strings.find)}
            field={currentField}
            isMulti={isMulti}
            onChange={(val) => {
              const property: ISelectFieldProperty = val ? {
                ...currentField.property,
                defaultValue: val,
              } : omit(currentField.property, 'defaultValue');
              setCurrentField({
                ...currentField,
                property
              });
            }}
            cellValue={defaultValue}
            listData={options.filter(option => Boolean(option.name.trim()))}
          />
        </div>
      )}
    </>
  );
};

// TODO: 临时兼容两端问题，后面合并逻辑
export const FormatSelect: React.FC<IFormatSelect> = props => {
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
