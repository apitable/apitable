import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Select, IOption, useThemeColors } from '@apitable/components';
import { FieldType, Strings, t, Selectors, IViewColumn } from '@apitable/core';
import { DatasheetOutlined } from '@apitable/icons';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

interface ISearchSelectFieldProps {
  datasheetId: string | undefined;
  defaultFieldId: string;
  fieldType?: FieldType[];
  onChange: (targetId: string) => void;
  disabled?: boolean;
}

export const SearchSelectField = (props: ISearchSelectFieldProps) => {
  const { datasheetId, fieldType = null, defaultFieldId, onChange, disabled = false } = props;
  const colors = useThemeColors();
  const columns = useAppSelector((state) => {
    const view = Selectors.getCurrentView(state, datasheetId);
    return (view?.columns || []) as IViewColumn[];
  });
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, datasheetId))!;

  const filter = (item: IViewColumn) => {
    if (fieldType) {
      const field = fieldMap[item.fieldId];
      if(field.type == FieldType.Button) {
        return false;
      }
      return fieldType.includes(field.type);
    }
    return true;
  };

  const options: IOption[] = columns.filter(filter).map(({ fieldId }) => {
    const field = fieldMap[fieldId];

    return {
      label: !fieldType?.includes(FieldType.Link) ? field.name : Selectors.getDatasheet(store.getState(), field.property.foreignDatasheetId)?.name!,
      value: field.id,
      prefixIcon: !fieldType?.includes(FieldType.Link) ? getFieldTypeIcon(field.type, colors.thirdLevelText)
        : <DatasheetOutlined color={colors.thirdLevelText} />,
      disabledTip: t(Strings.view_sort_and_group_disabled),
    };
  });

  function optionSelect(targetId: string) {
    onChange(targetId);
  }

  const listStyle = fieldType?.includes(FieldType.Link) ? {
    display: 'none'
  } : {};

  return (
    <div>
      <Select
        placeholder={t(Strings.pick_one_option)}
        options={options}
        onSelected={(option) => {
          optionSelect(option.value as string);
        }}
        dropdownMatchSelectWidth={false}
        value={defaultFieldId}
        triggerCls={styles.select}
        listStyle={listStyle}
        openSearch
        searchPlaceholder={t(Strings.search)}
        noDataTip={t(Strings.no_search_result)}
        disabled={disabled}
      />
    </div>
  );
};
