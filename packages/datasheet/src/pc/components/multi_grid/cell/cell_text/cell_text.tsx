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
} from '@vikadata/core';
import classNames from 'classnames';
import { useThemeColors } from '@vikadata/components';
import * as React from 'react';
import IconEmail from 'static/icon/datasheet/column/datasheet_icon_email.svg';
import IconPhone from 'static/icon/datasheet/column/datasheet_icon_phone.svg';
import IconURL from 'static/icon/datasheet/column/datasheet_icon_url.svg';
import { ICellComponentProps } from '../cell_value/interface';
import { useEnhanceTextClick } from '../hooks/use_enhance_text_click';
import style from './style.module.less';
import { UrlDiscern } from './url_discern';

// 采用简单的识别规则处理单行文本增强字段。
const isEmail = text => text && /.+@.+/.test(text);
const isPhoneNumber = text => text && /^[0-9\-()（）#+]+$/.test(text);

type ICellText = ICellComponentProps & {
  cellValue: ICellValue | typeof FormulaBaseError
  rowHeightLevel?: RowHeightLevel,
};

export const CellText: React.FC<ICellText> = props => {
  const colors = useThemeColors();
  const { className, field, cellValue, toggleEdit, isActive, rowHeightLevel } = props;
  const fieldType = field.type;
  const text = cellValue != null &&
    cellValue instanceof FormulaBaseError ? cellValue?.message : Field.bindModel(field).cellValueToString(cellValue);
  const { isEnhanceText: _isEnhanceText } = getTextFieldType(fieldType);
  const isEnhanceText = _isEnhanceText || fieldType === FieldType.Formula;
  const _handleEnhanceTextClick = useEnhanceTextClick();
  // 点击链接时校验 URL 合法性
  const handleURLClick = (e: React.MouseEvent, type: SegmentType | FieldType, text: string, active?: boolean) => {
    if (!active) return;
    _handleEnhanceTextClick(type, text);
  };
  const getEnhanceTypeIcon = type => {
    const typeIconMap = {
      [FieldType.URL]: <IconURL fill={colors.thirdLevelText} />,
      [FieldType.Email]: <IconEmail fill={colors.thirdLevelText} />,
      [FieldType.Phone]: <IconPhone fill={colors.thirdLevelText} />,
    };
    return (
      <span
        className={style.urlIcon}
        onClick={e => handleURLClick(e, type, text as string, isActive)}
      >
        {typeIconMap[type]}
      </span>
    );
  };
  let showUnderline = Boolean(text);
  const isNumberField = Field.bindModel(field).basicValueType === BasicValueType.Number ||
    (Field.bindModel(field) as ArrayValueField).innerBasicValueType === BasicValueType.Number;
  const isComputedField = Field.bindModel(field).isComputed;
  const isFormulaField = isFormula(fieldType);
  const isCurrencyAndAlignLeft = fieldType === FieldType.Currency && field.property.symbolAlign === SymbolAlign.left;
  const isLookUpField = fieldType === FieldType.LookUp;
  switch (fieldType) {
    case FieldType.URL:
      showUnderline = true; // 无论是否合规都识别为 URL
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
          (cellValue as ISegment[]).filter(segment => {
            if (fieldType === FieldType.URL) {
              // URL trim
              return Boolean(segment.text?.trim().length);
            }
            return true;
          }).map((segment, index) => {
            switch (segment.type) {
              case SegmentType.Text:
                return <span
                  key={`${segment.text}-${index}`}
                  style={{ cursor: isEnhanceText && isActive && showUnderline ? 'pointer' : 'inherit' }}
                  onMouseDown={e => handleEnhanceTextClick(e, fieldType, segment.text)}
                >
                  {segment.text}
                </span>;
              case SegmentType.Url:
                return (
                  <span
                    className={classNames(style.url, { [style.activeUrl]: isActive })}
                    key={`${segment.link}-${index}`}
                    // 只有激活状态下，点击链接才跳转。这里使用 onMouseDown 而不是 onClick
                    // onMouseDown 时单元格还未激活。onClick 时单元格无论如何都是激活状态
                    onMouseDown={e => handleURLClick(e, segment.type, segment.text, isActive)}
                  >
                    {segment?.title || segment.text}
                  </span>
                );
              case SegmentType.Email:
                return (
                  <span
                    className={classNames(style.url, { [style.activeUrl]: isActive })}
                    key={`${segment.link}-${index}`}
                    // 只有激活状态下，点击链接才跳转。这里使用 onMouseDown 而不是 onClick
                    // onMouseDown 时单元格还未激活。onClick 时单元格无论如何都是激活状态
                    onMouseDown={e => handleURLClick(e, segment.type, segment.text, isActive)}
                  >
                    {segment.text}
                  </span>
                );
              default:
                return null;
            }
          })
        }
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
    return <div className={style.currencyFieldWrap}>
      <div className={style.currencyFieldSymbol}>{currencyField.property.symbol}</div>
      <div className={style.currencyFieldText}>{pureNumText}</div>
    </div>;
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
      {
        (isFormulaField || isLookUpField) ? <UrlDiscern value={text} /> :
          isCurrencyAndAlignLeft ?
            renderCurrency() :
            (isNumberField || isComputedField) ?
              text :
              renderTextBaseCellValue()
      }
    </div>
  );
};
