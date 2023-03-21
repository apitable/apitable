import React, { CSSProperties, useMemo } from 'react';
import { Field, FieldType, IFieldMap, IViewColumn, IViewRow, Selectors, t, Strings } from '@apitable/core';
import EmptyImage from 'static/icon/datasheet/gallery/emptystates_img_datasheet.png';
import { store } from 'pc/store';
import Image from 'next/image';
import { DisplayFile } from 'pc/components/display_file';
import {
  RecordCardContainer,
  RecordCardStyled,
  RecordCardRow,
  RecordCardTitle,
  CellRow,
  CardCell,
  CardColumn,
  CellTitle,
  CellHolder,
  CellValue
} from './styled';
import { useSelector } from 'react-redux';

export interface IRecordCardProps {
  datasheetId: string;
  row: IViewRow;
  columns: IViewColumn[];
  fieldMap: IFieldMap;
  style?: CSSProperties;
  onClick?: (recordId: string) => void;
}

export const RecordCard: React.FC<IRecordCardProps> = props => {
  const { datasheetId, row, columns, fieldMap, style, onClick } = props;
  const state = store.getState();
  const snapshot = useSelector(Selectors.getSnapshot)!;
  const recordId = row.recordId;
  const [frozenColumn, ...remainColumns] = columns;
  const primaryFieldId = frozenColumn.fieldId;
  const primaryField = fieldMap[primaryFieldId];
  const attachmentColumn = remainColumns.find(column => {
    const field = fieldMap[column.fieldId];
    return field.type === FieldType.Attachment;
  });
  const normalColumnsCount = attachmentColumn ? 4 : 5;
  const primaryCellValue = Selectors.getCellValue(state, snapshot, recordId, primaryFieldId);
  const title = Field.bindModel(primaryField).cellValueToString(primaryCellValue);

  const normalColumns = useMemo(() => {
    return remainColumns.filter(column => {
      const field = fieldMap[column.fieldId];
      return field.type !== FieldType.Attachment;
    }).slice(0, normalColumnsCount);
  }, [normalColumnsCount, remainColumns, fieldMap]);

  const AttachmentPreview = (attachmentFieldId: string) => {
    const cellValue = Selectors.getCellValue(state, snapshot, recordId, attachmentFieldId);
    if (!cellValue) {
      return (
        <Image
          style={{ 
            objectFit: 'cover', 
            borderRadius: 3 
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
    <RecordCardContainer>
      <RecordCardStyled
        style={style}
        onClick={() => onClick?.(recordId)}
      >
        {
          recordId ? 
            <>
              <RecordCardRow>
                <RecordCardTitle
                  isEmpty={!Boolean(title)}
                >
                  {title || t(Strings.record_unnamed)}
                </RecordCardTitle>
                <CellRow>
                  {
                    normalColumns.map(column => {
                      const fieldId = column.fieldId;
                      const field = fieldMap[column.fieldId];
                      const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
                      return (
                        <CardColumn key={fieldId}>
                          <CellTitle>
                            {field.name}
                          </CellTitle>
                          <CardCell>
                            {
                              cellValue == null ?
                                <CellHolder /> :
                                <CellValue
                                  recordId={recordId}
                                  field={field}
                                  cellValue={cellValue}
                                  datasheetId={datasheetId}
                                />
                            }
                          </CardCell>
                        </CardColumn>
                      );
                    })
                  }
                </CellRow>
              </RecordCardRow>
              {attachmentColumn && AttachmentPreview(attachmentColumn.fieldId)}
            </> : 
            t(Strings.loading)
        }
      </RecordCardStyled>
    </RecordCardContainer>
  );
};
