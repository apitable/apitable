import { BasicValueType, Field, FieldType, getTextFieldType, ICellValue, IField, IViewColumn, Selectors, Strings, t } from '@apitable/core';
import classNames from 'classnames';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { useThemeColors } from '@vikadata/components';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { isNull } from 'util';
import { getFieldHeight, getShowFieldType, getVietualFieldHeight } from '../gallery_view/utils';
import { CardText } from './card_text';
import styles from './style.module.less';
import { store } from 'pc/store';
import { ScreenSize } from '../common/component_display';
import { useResponsive } from 'pc/hooks';
import { UrlDiscern } from 'pc/components/multi_grid/cell/cell_text/url_discern';

const showTitle = (cellValue: ICellValue, field: IField) => {
  if (isNull(cellValue)) return t(Strings.record_unnamed);
  return Field.bindModel(field).cellValueToString(cellValue);
};

interface IGalleryCardBodyProps {
  visibleFields: IViewColumn[];
  recordId: string;
  showEmptyField: boolean;
  multiTextMaxLine: number;
  isColNameVisible?: boolean;
  className?: string;
  isVirtual?: boolean;
  isGallery?: boolean;
}

const SINGLE_TEXT_TYPE = [FieldType.Formula, FieldType.Number, FieldType.Currency, FieldType.Percent, FieldType.DateTime];

export const CardBody: React.FC<IGalleryCardBodyProps> = props => {
  const { visibleFields, recordId, showEmptyField, multiTextMaxLine, isColNameVisible, className, isVirtual, isGallery } = props;
  const recordSnapshot = useSelector(state => Selectors.getRecordSnapshot(state, recordId), shallowEqual);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const colors = useThemeColors();
  if (!recordSnapshot || !visibleFields.length) return null;
  const fieldMap = recordSnapshot.meta.fieldMap;

  return (
    <div
      onClick={() => expandRecordIdNavigate(recordId)}
      className={classNames(styles.cardBody, className, {
        [styles.virtual]: isVirtual,
        [styles.virtualGallery]: isGallery,
        [styles.colName]: isColNameVisible,
      })}
      style={{ background: colors.defaultBg }}
    >
      {visibleFields.map((item, index) => {
        const cellValue = Selectors.getCellValue(store.getState(), recordSnapshot, recordId, item.fieldId);
        const field = fieldMap[item.fieldId];
        // 标题字段展示文字
        if (index === 0) {
          return (
            <div key={recordId} className={classNames(styles.cellTitle, styles.cellValue, 'ellipsis')}>
              <UrlDiscern value={showTitle(cellValue, field)} />
            </div>
          );
        }

        // 字段值为空时，看板不显示该字段
        if (cellValue == null && !showEmptyField) return null;
        const fieldType = getShowFieldType(field);
        const { isSingleText, isEnhanceText } = getTextFieldType(fieldType);
        const isTextField = isSingleText || isEnhanceText || fieldType === FieldType.Text; // 单行/多行/增强
        const isMultiSelectTypeField = Field.bindModel(field).basicValueType === BasicValueType.Array;
        // 由于信息密度不同，所以属性样式区分看板，相册类，其他
        // 相册类包括相册，架构视图
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
                      [styles.checkboxCell]: Field.bindModel(field).valueType === BasicValueType.Boolean,
                      [styles.ratingCell]: fieldType === FieldType.Rating,
                      [styles.multiSelectFieldCell]: isMultiSelectTypeField,
                      [styles.singleCell]: isVirtual && SINGLE_TEXT_TYPE.includes(fieldType),
                      [styles.isColNameHidden]: !isColNameVisible,
                      [styles.cardCell]: true,
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
