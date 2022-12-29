import { Field, FieldType, IField } from '@apitable/core';
import classnames from 'classnames';
import { getFieldHeight, getShowFieldType, getVietualFieldHeight } from 'pc/components/gallery_view/utils';
import * as React from 'react';
import styles from './style.module.less';
import { UrlDiscern } from 'pc/components/multi_grid/cell/cell_text/url_discern';

interface ICardTextProps {
  cellValue: string;
  field: IField;
  maxLine: number;
  autoHeight?: boolean;
  isColNameVisible?: boolean;
  isVirtual?: boolean;
}

export const EACH_TEXT_LINE_HEIGHT = 22;

export const CardText: React.FC<ICardTextProps> = ({ cellValue, field, maxLine, autoHeight, isColNameVisible, isVirtual }) => {
  const isMultiLine = getShowFieldType(field) === FieldType.Text;
  const text = Field.bindModel(field).cellValueToString(cellValue);
  const style: React.CSSProperties = { width: '100%' };
  if (autoHeight) {
    const contentHeight = getVietualFieldHeight(field, maxLine);
    style.height = contentHeight;
    style.marginTop = isColNameVisible ? 4 : 0;
    style.marginBottom = 8;
    style.lineHeight = '21px';
    style.overflow = 'hidden';
  } else {
    const contentHeight = getFieldHeight(field, maxLine);
    const textFieldHeight = contentHeight + 4 + 12;
    style.height = textFieldHeight;
    style.paddingTop = 4;
    style.paddingBottom = 12;
  }
  return (
    <div
      className={classnames({
        [styles.multi]: isMultiLine,
        [styles.single]: !isMultiLine,
        [styles.isVirtual]: isVirtual,
      })}
      style={style}
    >
      <UrlDiscern value={text} />
    </div>
  );
};
