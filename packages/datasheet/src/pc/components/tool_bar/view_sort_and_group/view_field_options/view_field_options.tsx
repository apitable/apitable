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
import * as React from 'react';
import { memo, useMemo, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { IOption, Select, useThemeColors, WrapperTooltip } from '@apitable/components';
import { Field, IViewColumn, Selectors, Strings, t } from '@apitable/core';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { renderComputeFieldError } from 'pc/components/multi_grid/header';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

interface IViewFieldOptions {
  defaultFieldId: string;
  onChange: (targetId: string) => void;
  existFieldIds: string[];
  isCryptoField?: boolean;
  fieldNotFound?: boolean;
  invalidFieldIds?: string[];
  invalidTip?: string;
  index?: number;
  isAddNewOption?: boolean; // Whether the operation of the current option is to add a new option.
}

export const ViewFieldOptions: React.FC<React.PropsWithChildren<IViewFieldOptions>> = memo((props) => {
  const colors = useThemeColors();
  const { onChange, isAddNewOption, defaultFieldId, existFieldIds, invalidFieldIds = [], invalidTip, isCryptoField, fieldNotFound } = props;
  const currentViewAllField = useAppSelector((state) => Selectors.getCurrentView(state))!.columns;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const [isOpen, setIsOpen] = useState(false);
  const fieldPermissionMap = useAppSelector((state) => {
    return Selectors.getFieldPermissionMap(state);
  });
  const isViewLock = useShowViewLockModal();

  function optionSelect(targetId: string) {
    onChange(targetId);
  }

  function toggleClick() {
    setIsOpen(!isOpen);
  }

  function filter(item: IViewColumn) {
    if (item.fieldId === defaultFieldId) {
      return true;
    }
    if (existFieldIds.includes(item.fieldId)) {
      return false;
    }
    return true;
  }

  const getSuffixIcon = (fieldId: string, isFieldInvalid: boolean) => {
    if (fieldPermissionMap && fieldPermissionMap[fieldId]) {
      return <FieldPermissionLock fieldId={fieldId} />;
    }
    if (isFieldInvalid) {
      const valid = renderComputeFieldError(fieldMap[fieldId], t(Strings.err_field_group_tip));
      return (
        valid && (
          <WrapperTooltip wrapper={isFieldInvalid} tip={invalidTip || ''}>
            {valid}
          </WrapperTooltip>
        )
      );
    }
    return;
  };

  const disabledFieldMap = useMemo(() => {
    const temp = {};
    currentViewAllField.forEach(({ fieldId }) => {
      const field = fieldMap[fieldId];
      return (temp[fieldId] = !Field.bindModel(field).canGroup || Field.bindModel(field).hasError);
    });
    return temp;
  }, [currentViewAllField, fieldMap]);

  const options: IOption[] = currentViewAllField.filter(filter).map(({ fieldId }) => {
    const field = fieldMap[fieldId];
    const isFieldInvalid = invalidFieldIds.some((di) => di === fieldId);
    const isDisabled = disabledFieldMap[fieldId];
    return {
      label: field.name,
      value: field.id,
      prefixIcon: getFieldTypeIcon(field.type, isDisabled ? colors.fourthLevelText : colors.thirdLevelText),
      suffixIcon: getSuffixIcon(field.id, Boolean(isFieldInvalid && invalidTip)),
      disabled: isDisabled,
      disabledTip: t(Strings.view_sort_and_group_disabled),
    };
  });

  useMemo(() => {
    if (!isCryptoField && !fieldNotFound) {
      return;
    }
    if (fieldNotFound) {
      options.push({
        label: t(Strings.current_field_fail),
        value: defaultFieldId,
        disabled: true,
      });
      return;
    }
    options.push({
      label: t(Strings.crypto_field),
      value: defaultFieldId,
      prefixIcon: undefined,
      suffixIcon: <FieldPermissionLock fieldId={defaultFieldId} />,
      disabled: true,
      disabledTip: t(Strings.disabled_crypto_field),
    });
  }, [isCryptoField, fieldNotFound, options, defaultFieldId]);

  return (
    <div
      onClick={toggleClick}
      className={classNames({
        [styles.sortOptions]: true,
        sortOptions: true,
        [styles.addOption]: isAddNewOption,
        [styles.blankField]: !existFieldIds.length,
      })}
    >
      <Select
        placeholder={t(Strings.pick_one_option)}
        options={options}
        onSelected={(option) => {
          optionSelect(option.value as string);
        }}
        dropdownMatchSelectWidth={false}
        value={defaultFieldId}
        triggerCls={styles.select}
        hideSelectedOption
        openSearch
        searchPlaceholder={t(Strings.search)}
        noDataTip={t(Strings.no_search_result)}
        disabled={isViewLock}
        disabledTip={t(Strings.view_lock_setting_desc)}
      />
    </div>
  );
});
