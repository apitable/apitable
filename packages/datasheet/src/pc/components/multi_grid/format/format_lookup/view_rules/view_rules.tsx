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
import { useThemeColors } from '@apitable/components';
import { BasicValueType, Field, IField, isSelectField, Selectors, Strings, t } from '@apitable/core';
import { ArrowRightOutlined, CheckboxFilled, CheckboxOutlined } from '@apitable/icons';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

interface IViewRules {
  index: number;
  onChange: (type: boolean) => void;
  rulesItem: { fieldId: string; desc: boolean };
  datasheetId: string;
  invalid?: boolean;
  invalidTip?: string;
}

export const ViewRules: React.FC<React.PropsWithChildren<IViewRules>> = (props) => {
  const colors = useThemeColors();
  const { onChange, rulesItem, datasheetId } = props;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, datasheetId))!;
  const field = fieldMap[rulesItem.fieldId];
  const isViewLock = useShowViewLockModal();

  if (!field) {
    return <></>;
  }
  const ascClass = classNames(styles.asc, !rulesItem.desc ? styles.active : '');
  const descClass = classNames(styles.desc, rulesItem.desc ? styles.active : '');

  // Returns the appropriate icon based on active.
  function renderCorrectIcon(className: string) {
    if (/active/.test(className)) {
      return <ArrowRightOutlined color={colors.staticWhite0} />;
    }
    return <ArrowRightOutlined color={colors.thirdLevelText} />;
  }

  function changeDescType(_e: React.MouseEvent, type: boolean) {
    if (isViewLock) return;
    onChange(type);
  }

  // Number Sorting.
  function sortTypeForNumber() {
    return (
      <>
        <div
          className={ascClass}
          onClick={(e) => {
            changeDescType(e, false);
          }}
        >
          1<div className={styles.iconArrow}>{renderCorrectIcon(ascClass)}</div>9
        </div>
        <div
          className={descClass}
          onClick={(e) => {
            changeDescType(e, true);
          }}
        >
          9<div className={styles.iconArrow}>{renderCorrectIcon(descClass)}</div>1
        </div>
      </>
    );
  }

  // Check Sort.
  function sortTypeForCheckbox() {
    const ascIconColor = !rulesItem.desc ? colors.staticWhite0 : colors.thirdLevelText;
    const descIconColor = rulesItem.desc ? colors.staticWhite0 : colors.thirdLevelText;
    return (
      <>
        <div
          className={ascClass}
          onClick={(e) => {
            changeDescType(e, false);
          }}
        >
          <CheckboxOutlined size={15} color={ascIconColor} />
          <div className={styles.iconArrow}>{renderCorrectIcon(ascClass)}</div>
          <CheckboxFilled size={15} color={ascIconColor} />
        </div>
        <div
          className={descClass}
          onClick={(e) => {
            changeDescType(e, true);
          }}
        >
          <CheckboxFilled size={15} color={descIconColor} />
          <div className={styles.iconArrow}>{renderCorrectIcon(descClass)}</div>
          <CheckboxOutlined size={15} color={descIconColor} />
        </div>
      </>
    );
  }

  // Alphabetical order.
  function sortTypeForLetter() {
    return (
      <>
        <div
          className={ascClass}
          onClick={(e) => {
            changeDescType(e, false);
          }}
        >
          A<div className={styles.iconArrow}>{renderCorrectIcon(ascClass)}</div>Z
        </div>

        <div
          className={descClass}
          onClick={(e) => {
            changeDescType(e, true);
          }}
        >
          Z<div className={styles.iconArrow}>{renderCorrectIcon(descClass)}</div>A
        </div>
      </>
    );
  }

  // Sort by order.
  function sortTypeForSequence() {
    return (
      <>
        <div
          className={ascClass}
          onClick={(e) => {
            changeDescType(e, false);
          }}
        >
          {t(Strings.desc_sort)}
        </div>
        <div
          className={descClass}
          onClick={(e) => {
            changeDescType(e, true);
          }}
        >
          {t(Strings.asc_sort)}
        </div>
      </>
    );
  }

  function judgeFieldRule(field: IField) {
    const { valueType } = Field.bindModel(field);

    // Sort by single-multi-select order, others are displayed according to the return type.
    // lookup entity fields are handled as string when single-multi-select.
    if (isSelectField(field)) {
      return sortTypeForSequence();
    }
    switch (valueType) {
      case BasicValueType.String:
        return sortTypeForLetter();
      case BasicValueType.Number:
      case BasicValueType.DateTime:
        return sortTypeForNumber();
      case BasicValueType.Boolean:
        return sortTypeForCheckbox();
      default:
        return sortTypeForLetter();
    }
  }

  return <div className={classNames(styles.rules, { [styles.disabled]: isViewLock })}>{judgeFieldRule(field)}</div>;
};
