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
import * as React from 'react';
import { useContext, useMemo } from 'react';
// eslint-disable-next-line no-restricted-imports
import { IOption, Select, useThemeColors } from '@apitable/components';
import {
  BasicValueType,
  checkTypeSwitch,
  Field,
  FieldType,
  FilterDuration,
  IFieldMap,
  IFilterCondition,
  IViewColumn,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import { ChevronDownOutlined, WarnCircleFilled } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { MobileSelect, Tooltip } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { renderComputeFieldError } from 'pc/components/multi_grid/header';
import { ViewFilterContext } from 'pc/components/tool_bar/view_filter/view_filter_context';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { ExecuteFilterFn } from '../interface';
import styles from './style.module.less';

interface IFilterFieldListProps {
  conditionIndex: number;
  changeFilter: (cb: ExecuteFilterFn) => void;
  condition: IFilterCondition<FieldType>;
  fieldMap: IFieldMap;
  isCryptoField?: boolean;
  fieldNotFound?: boolean;
  datasheetId?: string;
  columns: IViewColumn[];
  warnTextObj?: { string?: string };
}

const FilterFieldListBase: React.FC<React.PropsWithChildren<IFilterFieldListProps>> = (props) => {
  const { conditionIndex, changeFilter, condition, fieldMap, columns, warnTextObj, isCryptoField, fieldNotFound } = props;
  const colors = useThemeColors();
  const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMap);
  const { isViewLock } = useContext(ViewFilterContext);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  function getDefaultValue(valueType: Omit<BasicValueType, BasicValueType.Array>) {
    switch (valueType) {
      case BasicValueType.DateTime:
        return [FilterDuration.ExactDate, null];
      case BasicValueType.Boolean:
        return false;
      default:
        return null;
    }
  }

  function onChange(selectValue: string) {
    changeFilter((value) => {
      return produce(value, (draft) => {
        const field = fieldMap[selectValue];
        const condition = draft.conditions[conditionIndex];
        const { valueType } = Field.bindModel(field);
        draft.conditions[conditionIndex] = {
          fieldId: selectValue,
          fieldType: field.type,
          conditionId: condition.conditionId,
          operator: Field.bindModel(field).acceptFilterOperators[0],
          value: getDefaultValue(valueType) as any,
        } as any;
        return draft;
      });
    });
  }

  const getSuffixIcon = (fieldId: string, warnText?: string) => {
    if (fieldPermissionMap && fieldPermissionMap[fieldId]) {
      return <FieldPermissionLock fieldId={fieldId} tooltip={t(Strings.field_permission_view_lock_tips)} />;
    }
    return renderComputeFieldError(fieldMap[fieldId], t(Strings.error_configuration_and_invalid_filter_option), isMobile, warnText);
  };

  const options: IOption[] = columns.map((item) => {
    const field = fieldMap[item.fieldId];
    const warnText = warnTextObj && warnTextObj[item.fieldId];
    const hasError = Field.bindModel(field).hasError;
    const canFiltered = Field.bindModel(field).canFilter;
    return {
      label: field.name,
      disabled: Boolean(hasError || warnText || !canFiltered),
      value: item.fieldId,
      prefixIcon: getFieldTypeIcon(field.type!),
      suffixIcon: getSuffixIcon(item.fieldId, warnText),
    };
  });

  useMemo(() => {
    if (!isCryptoField && !fieldNotFound) {
      return;
    }
    if (fieldNotFound) {
      options.push({
        value: condition.fieldId,
        label: t(Strings.current_field_fail),
        disabled: true,
      });
      return;
    }
    options.push({
      value: condition.fieldId,
      label: t(Strings.crypto_field),
      disabled: true,
      suffixIcon: <FieldPermissionLock fieldId={condition.fieldId} tooltip={t(Strings.field_permission_view_lock_tips)} />,
    });
  }, [condition.fieldId, isCryptoField, fieldNotFound, options]);

  if (isMobile) {
    return (
      <MobileSelect
        optionData={options}
        onChange={onChange}
        defaultValue={condition.fieldId}
        title={t(Strings.please_choose)}
        disabled={isViewLock}
        triggerComponent={
          <div
            className={classNames(styles.trigger, {
              [styles.error]: isCryptoField || fieldNotFound ? false : Field.bindModel(fieldMap[condition.fieldId]).hasError,
            })}
          >
            <span>{options.filter((option) => option.value === condition.fieldId)[0]?.label}</span>
            {renderComputeFieldError(fieldMap[condition.fieldId], t(Strings.error_configuration_and_invalid_filter_option))}
            <ChevronDownOutlined className={styles.arrow} size={16} color={colors.fourthLevelText} />
          </div>
        }
      />
    );
  }

  return (
    <Select
      options={options}
      value={condition.fieldId}
      onSelected={(option) => {
        onChange(option.value as string);
      }}
      triggerCls={classNames(styles.field, 'filterField')}
      hideSelectedOption={isCryptoField || fieldNotFound}
      dropdownMatchSelectWidth={false}
      openSearch
      searchPlaceholder={t(Strings.search)}
      popupStyle={{
        zIndex: 1000,
      }}
      disabled={isViewLock}
      disabledTip={t(Strings.view_lock_setting_desc)}
      suffixIcon={
        checkTypeSwitch(condition, fieldMap[condition.fieldId]) && !isCryptoField ? (
          <Tooltip title={t(Strings.lookup_filter_condition_tip)} placement="top">
            <WarnCircleFilled color={colors.warningColor} size={20} />
          </Tooltip>
        ) : undefined
      }
    />
  );
};

export const FilterFieldList = React.memo(FilterFieldListBase);
