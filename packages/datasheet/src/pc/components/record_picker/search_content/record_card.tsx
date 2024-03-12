import classNames from 'classnames';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { Field, FieldType, IFieldMap, IViewColumn, IViewRow, Selectors, t, Strings } from '@apitable/core';
import { DisplayFile } from 'pc/components/display_file';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import EmptyImage from 'static/icon/datasheet/gallery/emptystates_img_datasheet.png';
import styles from './style.module.less';

export interface IRecordCardProps {
  datasheetId: string;
  row: IViewRow;
  columns: IViewColumn[];
  fieldMap: IFieldMap;
  onClick?: (recordId: string) => void;
}

export const RecordCard: React.FC<IRecordCardProps> = (props) => {
  const { datasheetId, row, columns, fieldMap, onClick } = props;
  const state = store.getState();
  const snapshot = useAppSelector(Selectors.getSnapshot)!;
  const recordId = row.recordId;
  const [frozenColumn, ...remainColumns] = columns;
  const primaryFieldId = frozenColumn.fieldId;
  const primaryField = fieldMap[primaryFieldId];
  const attachmentColumn = remainColumns.find((column) => {
    const field = fieldMap[column.fieldId];
    return field.type === FieldType.Attachment;
  });
  const normalColumnsCount = attachmentColumn ? 4 : 5;
  const primaryCellValue = Selectors.getCellValue(state, snapshot, recordId, primaryFieldId);
  const title = Field.bindModel(primaryField).cellValueToString(primaryCellValue);

  const normalColumns = useMemo(() => {
    return remainColumns
      .filter((column) => {
        const field = fieldMap[column.fieldId];
        return field.type !== FieldType.Attachment;
      })
      .slice(0, normalColumnsCount);
  }, [normalColumnsCount, remainColumns, fieldMap]);

  const AttachmentPreview = (attachmentFieldId: string) => {
    const cellValue = Selectors.getCellValue(state, snapshot, recordId, attachmentFieldId);
    if (!cellValue) {
      return (
        <Image
          style={{
            objectFit: 'cover',
            borderRadius: 3,
          }}
          src={EmptyImage}
          alt="NoImage"
          width={90}
          height={90}
        />
      );
    }

    return (
      <DisplayFile
        index={0}
        fileList={cellValue}
        width={90}
        height={90}
        cutImage
        recordId={recordId}
        field={fieldMap[attachmentFieldId]}
        editable={false}
      />
    );
  };

  return (
    <div className={styles.recordCardContainer}>
      <div className={styles.recordCardStyled} onClick={() => onClick?.(recordId)}>
        {recordId ? (
          <>
            <div className={styles.recordCardRow}>
              <h3 className={classNames(styles.recordCardTitle, !Boolean(title) && styles.recordCardTitleEmpty)}>
                {title || t(Strings.record_unnamed)}
              </h3>
              <div className={styles.cellRow}>
                {normalColumns.map((column) => {
                  const fieldId = column.fieldId;
                  const field = fieldMap[column.fieldId];
                  const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
                  return (
                    <div className={styles.cardColumn} key={fieldId}>
                      <div className={styles.cellTitle}>{field.name}</div>
                      <div className={styles.cardCell}>
                        {cellValue == null ? (
                          <div className={styles.cellHolder} />
                        ) : (
                          <CellValue
                            recordId={recordId}
                            field={field}
                            cellValue={cellValue}
                            datasheetId={datasheetId}
                            className={styles.cellValueComponent}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {attachmentColumn && AttachmentPreview(attachmentColumn.fieldId)}
          </>
        ) : (
          t(Strings.loading)
        )}
      </div>
    </div>
  );
};
