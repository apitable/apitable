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

import { BasicValueType, Field, IField, isSelectField, Selectors, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import { useThemeColors } from '@apitable/components';
import * as React from 'react';
import { useSelector } from 'react-redux';
import CheckedIcon from 'static/icon/datasheet/column/datasheet_icon_checkbox.svg';
import CheckIcon from 'static/icon/datasheet/datasheet_icon_checkbox_normal.svg';
import IconArrowGray from 'static/icon/datasheet/datasheet_icon_toward_right_gray.svg';
import styles from './style.module.less';
import { Tooltip } from 'pc/components/common/tooltip';

interface IViewRules {
  index: number;
  onChange: (type: boolean) => void;
  rulesItem: { fieldId: string; desc: boolean };
  invalid?: boolean;
  invalidTip?: string;
}

export const ViewRules: React.FC<React.PropsWithChildren<IViewRules>> = props => {
  const colors = useThemeColors();
  const { onChange, rulesItem, invalid, invalidTip } = props;
  const fieldMap = useSelector(state => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const field = fieldMap[rulesItem.fieldId];
  if (!field) {
    return <></>;
  }
  const ascClass = classNames(styles.asc, !rulesItem.desc ? styles.active : '');
  const descClass = classNames(styles.desc, rulesItem.desc ? styles.active : '');
  // Returns the appropriate icon based on active.
  function renderCorrectIcon(className: string) {
    if (/active/.test(className)) {
      return <IconArrowGray fill={colors.staticWhite0} />;
    }
    return <IconArrowGray fill={colors.thirdLevelText} />;

  }
  function changeDescType(_e: React.MouseEvent, type: boolean) {
    onChange(type);
  }

  // Number Sorting.
  function sortTypeForNumber() {
    return (
      <>
        <div className={ascClass} onClick={e => { changeDescType(e, false); }}>
          1
          <div className={styles.iconArrow}>
            {renderCorrectIcon(ascClass)}
          </div>
          9
        </div>
        <div className={descClass} onClick={e => { changeDescType(e, true); }}>
          9
          <div className={styles.iconArrow}>
            {renderCorrectIcon(descClass)}
          </div>
          1
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
        <div className={ascClass} onClick={e => { changeDescType(e, false); }}>
          <CheckIcon width={15} height={15} fill={ascIconColor} />
          <div className={styles.iconArrow}>
            {renderCorrectIcon(ascClass)}
          </div>
          <CheckedIcon width={15} height={15} fill={ascIconColor} />
        </div>
        <div className={descClass} onClick={e => { changeDescType(e, true); }}>
          <CheckedIcon width={15} height={15} fill={descIconColor} />
          <div className={styles.iconArrow}>
            {renderCorrectIcon(descClass)}
          </div>
          <CheckIcon width={15} height={15} fill={descIconColor} />
        </div>
      </>
    );
  }

  // Alphabetical order.
  function sortTypeForLetter() {
    return (
      <>
        <div className={ascClass} onClick={e => { changeDescType(e, false); }}>
          A
          <div className={styles.iconArrow}>
            {renderCorrectIcon(ascClass)}
          </div>
          Z
        </div>

        <div className={descClass} onClick={e => { changeDescType(e, true); }}>
          Z
          <div className={styles.iconArrow}>
            {renderCorrectIcon(descClass)}
          </div>
          A
        </div>
      </>
    );
  }

  // Sort by order.
  function sortTypeForSequence() {
    return (
      <>
        <div className={ascClass} onClick={e => { changeDescType(e, false); }}>
          {t(Strings.desc_sort)}
        </div>
        <div className={descClass} onClick={e => { changeDescType(e, true); }}>
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

  return invalid ? (
    <Tooltip title={invalidTip}>
      <div className={styles.rules}>
        {judgeFieldRule(field)}
      </div>
    </Tooltip>
  ) : (
    <div className={styles.rules}>
      {judgeFieldRule(field)}
    </div>
  );
};
