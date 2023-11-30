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
import {
  ArrayValueField,
  BasicValueType,
  Field,
  FieldType,
  FormulaBaseError,
  getTextFieldType,
  ICellValue,
  ICurrencyField,
  ISegment,
  isFormula,
  RowHeightLevel,
  SegmentType,
  SymbolAlign,
} from '@apitable/core';
import { TelephoneOutlined, EmailOutlined, LinkOutlined } from '@apitable/icons';
import { ICellComponentProps } from '../cell_value/interface';
import { useEnhanceTextClick } from '../hooks/use_enhance_text_click';
import { UrlDiscern } from './url_discern';
import style from './style.module.less';

// Simple recognition rules are used to process single line text enhancement fields.
const isEmail = (text: string | null) => text && /.+@.+/.test(text);
const isPhoneNumber = (text: string) => text && /^[0-9\-()（）#+]+$/.test(text);

type ICellText = ICellComponentProps & {
  cellValue: ICellValue | typeof FormulaBaseError;
  rowHeightLevel?: RowHeightLevel;
};

export const CellText: React.FC<React.PropsWithChildren<ICellText>> = (props) => {
  const colors = useThemeColors();
  const { className, field, cellValue, toggleEdit, isActive, rowHeightLevel } = props;
  const fieldType = field.type;
  const text = cellValue != null && cellValue instanceof FormulaBaseError ? cellValue?.message : Field.bindModel(field).cellValueToString(cellValue);
  const { isEnhanceText: _isEnhanceText } = getTextFieldType(fieldType);
  const isEnhanceText = _isEnhanceText || fieldType === FieldType.Formula;
  const _handleEnhanceTextClick = useEnhanceTextClick();
  // Verify URL legitimacy when clicking on links
  const handleURLClick = (_e: React.MouseEvent, type: SegmentType | FieldType, text: string, active?: boolean) => {
    if (!active) return;
    _handleEnhanceTextClick(type, text);
  };
  const getEnhanceTypeIcon = (type: FieldType) => {
    const typeIconMap = {
      [FieldType.URL]: <LinkOutlined color={colors.thirdLevelText} />,
      [FieldType.Email]: <EmailOutlined color={colors.thirdLevelText} />,
      [FieldType.Phone]: <TelephoneOutlined color={colors.thirdLevelText} />,
    };
    return (
      <span className={style.urlIcon} onClick={(e) => handleURLClick(e, type, text as string, isActive)}>
        {typeIconMap[type]}
      </span>
    );
  };
  let showUnderline = Boolean(text);
  const isNumberField =
    Field.bindModel(field).basicValueType === BasicValueType.Number ||
    (Field.bindModel(field) as ArrayValueField).innerBasicValueType === BasicValueType.Number;
  const isComputedField = Field.bindModel(field).isComputed;
  const isFormulaField = isFormula(fieldType);
  const isCurrencyAndAlignLeft = fieldType === FieldType.Currency && field.property.symbolAlign === SymbolAlign.left;
  const isLookUpField = fieldType === FieldType.LookUp;
  switch (fieldType) {
    case FieldType.URL:
      showUnderline = true; // Identified as a URL regardless of compliance
      break;
    case FieldType.Email:
      showUnderline = Boolean(showUnderline && isEmail(text));
      break;
    case FieldType.Phone:
      showUnderline = Boolean(showUnderline && text && isPhoneNumber(text));
      break;
    default:
      showUnderline = false;
  }

  const handleEnhanceTextClick = (e: React.MouseEvent, fieldType: FieldType, text: string) => {
    if (isEnhanceText && showUnderline) {
      handleURLClick(e, fieldType, text, isActive);
    }
  };

  const renderTextBaseCellValue = () => {
    if (cellValue == null) {
      return null;
    }
    return (
      <>
        {Field.bindModel(field).validate(cellValue) &&
          (cellValue as ISegment[])
            .filter((segment) => {
              if (fieldType === FieldType.URL) {
                // URL trim
                return Boolean(segment.text?.trim().length);
              }
              return true;
            })
            .map((segment, index) => {
              switch (segment.type) {
                case SegmentType.Text:
                  return (
                    <span
                      key={`${segment.text}-${index}`}
                      style={{ cursor: isEnhanceText && isActive && showUnderline ? 'pointer' : 'inherit' }}
                      onMouseDown={(e) => handleEnhanceTextClick(e, fieldType, segment.text)}
                    >
                      {segment.text}
                    </span>
                  );
                case SegmentType.Url:
                  return (
                    <span
                      className={classNames(style.url, { [style.activeUrl]: isActive })}
                      key={`${segment.link}-${index}`}
                      // The link will only jump if it is active. Here we use onMouseDown instead of onClick.
                      // onMouseDown when the cell is not yet active. onClick when the cell is active anyway
                      onMouseDown={(e) => handleURLClick(e, segment.type, segment.text, isActive)}
                    >
                      {segment?.title || segment.text}
                    </span>
                  );
                case SegmentType.Email:
                  return (
                    <span
                      className={classNames(style.url, { [style.activeUrl]: isActive })}
                      key={`${segment.link}-${index}`}
                      onMouseDown={(e) => handleURLClick(e, segment.type, segment.text, isActive)}
                    >
                      {segment.text}
                    </span>
                  );
                default:
                  return null;
              }
            })}
        {isEnhanceText && isActive && text && getEnhanceTypeIcon(fieldType)}
      </>
    );
  };

  const renderCurrency = () => {
    if (!text) {
      return '';
    }
    const currencyField = field as ICurrencyField;
    const pureNumText = text.replace(currencyField.property.symbol, '');
    return (
      <div className={style.currencyFieldWrap}>
        <div className={style.currencyFieldSymbol}>{currencyField.property.symbol}</div>
        <div className={style.currencyFieldText}>{pureNumText}</div>
      </div>
    );
  };

  return (
    <div
      className={classNames(className, style.cellText, 'cellText', {
        currencyLeft: isCurrencyAndAlignLeft,
        [style.cellEnhanceText]: isEnhanceText && showUnderline,
        [style.activeText]: isEnhanceText && showUnderline && isActive,
        [style[`rowHeight${rowHeightLevel}`]]: rowHeightLevel && !isNumberField,
        [style.numberCell]: rowHeightLevel && isNumberField,
        [style.activeCellText]: isActive,
      })}
      onDoubleClick={toggleEdit}
    >
      {isFormulaField || isLookUpField ? (
        <UrlDiscern value={text} />
      ) : isCurrencyAndAlignLeft ? (
        renderCurrency()
      ) : isNumberField || isComputedField ? (
        text
      ) : (
        renderTextBaseCellValue()
      )}
    </div>
  );
};
