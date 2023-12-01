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
import Image from 'next/image';
import * as React from 'react';
import { useMemo } from 'react';
import { Field, FieldType, IField, IRecord, IReduxState, IViewColumn, Selectors, Strings, t } from '@apitable/core';
import { SubtractCircleFilled } from '@apitable/icons';
import { DisplayFile } from 'pc/components/display_file';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import NoImage from 'static/icon/datasheet/gallery/emptystates_img_datasheet.png';
import { ScreenSize } from '../component_display';
import styles from './style.module.less';

export interface IRecordCardProps {
  record: IRecord;
  columns: IViewColumn[];
  fieldMap: { [fieldId: string]: IField };
  datasheetId: string;
  onDelete?: (recordId: string) => void;
  onClick?: (recordId: string) => void;
  className?: string;
}

export const RecordCard: React.FC<React.PropsWithChildren<IRecordCardProps>> = (props) => {
  const { record, columns, fieldMap, onClick, onDelete, datasheetId } = props;
  const [firstColumn, ...remainingColumns] = columns;
  const primaryField = fieldMap[firstColumn.fieldId];
  const state = store.getState();
  const attachmentColumn = remainingColumns.find((column) => {
    const field = fieldMap[column.fieldId];
    return field?.type === FieldType.Attachment;
  });

  const { formId, primaryCellValue } = useAppSelector((state) => {
    const primaryCellValue = Selectors.getCellValue(
      state,
      {
        meta: { fieldMap },
        recordMap: { [record.id]: record },
        datasheetId,
      },
      record.id,
      primaryField.id,
    );
    return {
      formId: state.pageParams.formId,
      primaryCellValue,
    };
  });
  const { screenIsAtMost } = useResponsive();

  const _foreignDstReadable = useAppSelector((state: IReduxState) => Selectors.getPermissions(state, datasheetId).readable);
  const foreignDstReadable = Boolean(_foreignDstReadable || formId);

  const normalColumnsCount = attachmentColumn || screenIsAtMost(ScreenSize.md) ? 4 : 5;

  const normalColumns = useMemo(() => {
    return remainingColumns
      .filter((column) => {
        const field = fieldMap[column.fieldId];
        return field.type !== FieldType.Attachment;
      })
      .slice(0, normalColumnsCount);
  }, [fieldMap, normalColumnsCount, remainingColumns]);

  const CardRow = () => {
    const title = Field.bindModel(primaryField).cellValueToString(primaryCellValue);
    return (
      <div
        className={classNames({
          [styles.cardRow]: true,
          [styles.noReadablePermission]: !foreignDstReadable,
        })}
      >
        <h3 className={classNames(styles.cardTitle, title ? '' : styles.gray, 'ellipsis')}>{title || t(Strings.record_unnamed)}</h3>
        {foreignDstReadable && (
          <div className={styles.cellRow}>
            {normalColumns.map((column) => {
              const field = fieldMap[column.fieldId];
              const cellValue = Selectors.getCellValue(
                state,
                {
                  meta: { fieldMap: { [field.id]: field } },
                  recordMap: { [record.id]: record },
                  datasheetId,
                },
                record.id,
                field.id,
              );
              return (
                <div key={field.id} className={styles.cardColumn}>
                  <h5 className={classNames(styles.cellTitle, 'ellipsis')}>{field.name}</h5>
                  <div className={styles.cardCell}>
                    {cellValue == null ? (
                      <span className={styles.cellHolder} />
                    ) : (
                      <CellValue className={styles.cellValue} recordId={record.id} field={field} cellValue={cellValue} datasheetId={datasheetId} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const AttachmentPreview = (attachmentColumn: IViewColumn) => {
    const field = fieldMap[attachmentColumn.fieldId];
    const cellValue = Selectors.getCellValue(
      state,
      {
        meta: { fieldMap: { [field.id]: field } },
        recordMap: { [record.id]: record },
      },
      record.id,
      field.id,
    );
    if (!cellValue) {
      return <Image style={{ objectFit: 'cover', borderRadius: 3 }} src={NoImage} alt="NoImage" width={90} height={90} />;
    }

    return (
      <>
        <DisplayFile
          index={0}
          fileList={cellValue}
          width={90}
          height={90}
          cutImage
          recordId={record.id}
          field={fieldMap[attachmentColumn.fieldId]}
          editable={false}
        />
      </>
    );
  };

  return (
    <div className={styles.recordCardWrapper}>
      {onDelete && <SubtractCircleFilled className={styles.deleteLinkRecord} onClick={() => onDelete(record.id)} />}
      <div className={classNames(styles.recordCard, props.className)} onClick={() => onClick && onClick(record.id)}>
        {record ? (
          <>
            {CardRow()}
            {attachmentColumn && foreignDstReadable && AttachmentPreview(attachmentColumn)}
          </>
        ) : (
          t(Strings.loading)
        )}
      </div>
    </div>
  );
};
