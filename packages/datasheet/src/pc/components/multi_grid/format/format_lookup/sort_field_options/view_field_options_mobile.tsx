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
import { useState } from 'react';
import { useThemeColors } from '@apitable/components';
import { Field, IViewColumn, Selectors, Strings, t } from '@apitable/core';
import { ChevronDownOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { Popup } from 'pc/components/common/mobile/popup';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { renderComputeFieldError } from 'pc/components/multi_grid/header';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

interface IViewFieldOptionsMobile {
  onChange: (targetId: string) => void;
  existFieldIds: string[];
  defaultFieldId: string;
  datasheetId: string;
  index?: number;
  isAddNewOption?: boolean; // Whether the operation of the current option is to add a new option.
  isCryptoField?: boolean;
  fieldNotFound?: boolean;
}

export const ViewFieldOptionsMobile: React.FC<React.PropsWithChildren<IViewFieldOptionsMobile>> = (props) => {
  const { existFieldIds, onChange, defaultFieldId, isCryptoField, fieldNotFound, datasheetId } = props;
  const colors = useThemeColors();
  // const currentViewAllField = useAppSelector(state => Selectors.getCurrentView(state))!.columns;
  const columns = useAppSelector((state) => {
    const view = Selectors.getCurrentView(state, datasheetId);
    return view!.columns as IViewColumn[];
  });
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, datasheetId))!;
  const isViewLock = useShowViewLockModal();

  function predicate(item: IViewColumn) {
    if (existFieldIds.includes(item.fieldId)) {
      return false;
    }
    return true;
  }

  const [optionsVisible, setOptionsVisible] = useState(false);

  const filteredOptions = columns.filter(predicate);

  const onClose = () => {
    setOptionsVisible(false);
  };

  const getDefaultLabel = () => {
    if (fieldNotFound) {
      return t(Strings.current_field_fail);
    }
    if (isCryptoField) {
      return t(Strings.crypto_field);
    }
    return fieldMap[defaultFieldId]?.name || t(Strings.sort_rules);
  };

  return (
    <>
      <div className={classNames(styles.addSortRules, { [styles.disabled]: isViewLock })} onClick={() => !isViewLock && setOptionsVisible(true)}>
        <span>{getDefaultLabel()}</span>
        <ChevronDownOutlined className={styles.arrow} size={16} color={colors.thirdLevelText} />
      </div>
      <Popup open={optionsVisible} title={t(Strings.title_select_sorting_fields)} height="50%" onClose={onClose} className={styles.optionsListMenu}>
        <div className={styles.optionsListWrapper}>
          {filteredOptions.length
            ? filteredOptions.map((item) => {
              const field = fieldMap[item.fieldId];
              const disabled = !Field.bindModel(field).canGroup || Field.bindModel(field).hasError;

              const Inner = (
                <div
                  className={styles.optionItem}
                  key={field.id}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }
                    onChange(field.id);
                    setOptionsVisible(false);
                  }}
                >
                  <div className={styles.fieldItem}>
                    {getFieldTypeIcon(field.type, disabled ? colors.fourthLevelText : colors.thirdLevelText)}
                    <span
                      className={styles.fieldName}
                      style={{
                        color: disabled ? colors.fourthLevelText : 'inherit',
                      }}
                    >
                      {field.name}
                    </span>
                  </div>
                  {renderComputeFieldError(field, t(Strings.error_configuration_and_invalid_filter_option), true)}
                </div>
              );

              return (
                <>
                  {disabled ? (
                    <Tooltip title={t(Strings.view_sort_and_group_disabled)} showTipAnyway>
                      {Inner}
                    </Tooltip>
                  ) : (
                    Inner
                  )}
                </>
              );
            })
            : t(Strings.no_option)}
        </div>
      </Popup>
    </>
  );
};
