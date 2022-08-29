import * as React from 'react';
import styles from './styles.module.less';
import { useSelector } from 'react-redux';
import { Selectors, FieldTypeDescriptionMap, t, Strings, Field } from '@vikadata/core';
import { getFieldDocs } from './api_panel_config';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { useThemeColors } from '@vikadata/components';

interface IFieldDocs {
  recordId?: string;
  fieldId: string;
}

const convertToPrintString = (v: any) => {
  if (v != null) {
    if (typeof v === 'object' || typeof v === 'string') {
      return JSON.stringify(v, null, 2);
    }
  }
  return v;
};

const FieldDocsItem: React.FC<IFieldDocs> = props => {
  const colors = useThemeColors();
  const { fieldId, recordId } = props;
  const field = useSelector(state => Selectors.getField(state, fieldId));
  const cellValue = useSelector(state => {
    if (!recordId) {
      return null;
    }
    const snapshot = Selectors.getSnapshot(state)!;
    return Selectors.getCellValue(state, snapshot, recordId, fieldId);
  });

  const fieldDocs = getFieldDocs(field.type);
  const fieldExample =
    convertToPrintString(Field.bindModel(field).cellValueToApiStandardValue(cellValue)) 
    || t(Strings[fieldDocs.defaultExampleId!]);
  const fieldInfo = FieldTypeDescriptionMap[field.type];
  const fieldSmallIcon = getFieldTypeIcon(field.type, colors.primaryColor, 16, 16);
  const fieldLargeIcon = getFieldTypeIcon(field.type, colors.black[50], 24, 24);
  const fieldDescription = t(Strings[fieldDocs.descriptionId!]);

  return (
    <div className={styles.fieldDocsCard}>
      <h2 className={styles.fieldName}>
        {fieldSmallIcon} {field.name} <span className={styles.fieldId}>Field ID: {field.id}</span>
      </h2>
      <div className={styles.splitWrapper}>
        <div className={styles.leftPart}>
          <h4 className={styles.subTitle}>
            {t(Strings.field_type)}
          </h4>
          <div className={styles.largeIconWrapper}>
            {fieldLargeIcon}
            <div className={styles.title}>{fieldInfo.title}</div>
          </div>
          <div className={styles.fieldValueType}>{fieldDocs.valueType}</div>
        </div>
        <div className={styles.rightPart}>
          <h4 className={styles.subTitle}>{t(Strings.description)}</h4>
          <pre className={styles.fieldValueDescription}>{fieldDescription}</pre>
          <h4 className={styles.subTitle}>{t(Strings.example_value)}</h4>
          <pre className={styles.fieldValueExample}><code>{fieldExample}</code></pre>
        </div>
      </div>
    </div>
  );
};

export const FieldDocs: React.FC = () => {
  const columns = useSelector(Selectors.getVisibleColumns);
  const firstRecordId = useSelector(state => {
    const firstRow = Selectors.getVisibleRows(state)[0];
    return firstRow?.recordId;
  });

  return <>
    {columns.map(column => {
      return <FieldDocsItem key={column.fieldId} fieldId={column.fieldId} recordId={firstRecordId} />;
    })}
  </>;
};
