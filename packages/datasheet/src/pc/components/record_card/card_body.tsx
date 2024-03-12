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

import { isNull } from 'util';
import classNames from 'classnames';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { Typography, useThemeColors } from '@apitable/components';
import {
  BasicValueType,
  Field,
  FieldType,
  getTextFieldType,
  ICellValue,
  IField,
  IViewColumn,
  Selectors,
  Strings,
  t
} from '@apitable/core';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { ScreenSize } from '../common/component_display';
import { getFieldHeight, getShowFieldType, getVietualFieldHeight } from '../gallery_view/utils';
import { CardText } from './card_text';
import styles from './style.module.less';

const showTitle = (cellValue: ICellValue, field: IField) => {
  if (isNull(cellValue)) return t(Strings.record_unnamed);
  return Field.bindModel(field).cellValueToString(cellValue);
};

interface IGalleryCardBodyProps {
  visibleFields: IViewColumn[];
  datasheetId: string;
  recordId: string;
  showEmptyField: boolean;
  multiTextMaxLine: number;
  isColNameVisible?: boolean;
  className?: string;
  isVirtual?: boolean;
  isGallery?: boolean;
}

const SINGLE_TEXT_TYPE = [FieldType.Formula, FieldType.Number, FieldType.Currency, FieldType.Percent, FieldType.DateTime, FieldType.Button];

export const CardBody: React.FC<React.PropsWithChildren<IGalleryCardBodyProps>> = (props) => {
  const { visibleFields, recordId, showEmptyField, multiTextMaxLine, isColNameVisible, className, isVirtual, isGallery, datasheetId } = props;
  const recordSnapshot = useAppSelector((state) => Selectors.getRecordSnapshot(state, datasheetId, recordId), shallowEqual);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const colors = useThemeColors();
  if (!recordSnapshot || !visibleFields.length) return null;
  const fieldMap = recordSnapshot.meta.fieldMap;

  return (
    <div
      onClick={() => expandRecordIdNavigate(recordId)}
      className={classNames(styles.cardBody, className, {
        [styles.virtual!]: isVirtual,
        [styles.virtualGallery!]: isGallery,
        [styles.colName!]: isColNameVisible,
      })}
      style={{ background: colors.defaultBg }}
    >
      {visibleFields.map((item, index) => {
        const cellValue = Selectors.getCellValue(store.getState(), recordSnapshot, recordId, item.fieldId);
        const field = fieldMap[item.fieldId]!;
        if (index === 0) {
          return (
            <div key={recordId} className={classNames(styles.cellTitle, styles.cellValue, 'ellipsis')}>
              <Typography
                variant="h7"
                ellipsis
              >
                {showTitle(cellValue, field)}
              </Typography>
            </div>
          );
        }

        // When the field value is empty, the Kanban does not display the field
        if (cellValue == null && !showEmptyField) return null;
        const fieldType = getShowFieldType(field);
        const { isSingleText, isEnhanceText } = getTextFieldType(fieldType);
        const isTextField = isSingleText || isEnhanceText || fieldType === FieldType.Text;
        const isMultiSelectTypeField = Field.bindModel(field).basicValueType === BasicValueType.Array;
        // Because of the different information density, the attribute style distinguishes between Kanban, Gallery and other
        // Gallery includes Gallery and Organization Chart
        const fieldValueStyle: React.CSSProperties = isVirtual
          ? {}
          : isGallery
            ? { height: 4 + getVietualFieldHeight(field, multiTextMaxLine, isMobile) + 8 }
            : { height: 4 + getFieldHeight(field, multiTextMaxLine, isMobile) + 12 };
        return (
          <div key={item.fieldId} className={styles.fieldItem}>
            {isColNameVisible && (
              <div className={styles.fieldHead}>
                {getFieldTypeIcon(field.type, colors.thirdLevelText, 12, 12)}
                <span className={styles.fieldName}>{field.name}</span>
              </div>
            )}
            <div className={styles.fieldValue} style={fieldValueStyle}>
              {cellValue == null ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div className={styles.cellHolder} />
                </div>
              ) : isTextField ? (
                <CardText
                  field={field}
                  cellValue={cellValue}
                  maxLine={multiTextMaxLine}
                  autoHeight={isVirtual || isGallery}
                  isColNameVisible={isColNameVisible}
                  isVirtual={isVirtual || isGallery}
                />
              ) : (
                <CellValue
                  field={field}
                  recordId={recordId}
                  cellValue={cellValue}
                  className={classNames(
                    {
                      [styles.checkboxCell!]: Field.bindModel(field).valueType === BasicValueType.Boolean,
                      [styles.ratingCell!]: fieldType === FieldType.Rating,
                      [styles.multiSelectFieldCell!]: isMultiSelectTypeField,
                      [styles.singleCell!]: isVirtual && SINGLE_TEXT_TYPE.includes(fieldType),
                      [styles.isColNameHidden!]: !isColNameVisible,
                      [styles.cardCell!]: true,
                    },
                    styles.cellValue,
                  )}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
