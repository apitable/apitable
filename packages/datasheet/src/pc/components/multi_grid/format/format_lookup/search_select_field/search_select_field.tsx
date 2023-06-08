import * as React from 'react';
import { Select, IOption, useThemeColors } from '@apitable/components';
import { FieldType, Strings, t, Selectors, IViewColumn } from '@apitable/core';
import { useSelector } from 'react-redux';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import styles from './style.module.less';

interface ISearchSelectFieldProps { 
  datasheetId: string | undefined;
  defaultFieldId: string;
  fieldType?: FieldType;
  onChange: (targetId: string) => void;
}

export const SearchSelectField = (props: ISearchSelectFieldProps) => {
  const { datasheetId, fieldType = null, defaultFieldId, onChange } = props;

  const colors = useThemeColors();
  const columns = useSelector(state => {
    const view = Selectors.getCurrentView(state, datasheetId);
    return view!.columns as IViewColumn[];
  });
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, datasheetId))!;

  const filter = (item: IViewColumn) => {
    if(fieldType) {
      const field = fieldMap[item.fieldId];
      return field.type === fieldType;
    }
    return true;
  };

  const options: IOption[] = columns.filter(filter).map(({ fieldId }) => {
    const field = fieldMap[fieldId];
    return {
      label: field.name,
      value: field.id,
      prefixIcon: getFieldTypeIcon(field.type, colors.thirdLevelText),
      disabledTip: t(Strings.view_sort_and_group_disabled),
    };
  });

  function optionSelect(targetId: string) {
    onChange(targetId);
  }

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
        openSearch
        searchPlaceholder={t(Strings.search)}
        noDataTip={t(Strings.no_search_result)}
      />
    </div>
  );
};