import { ILastModifiedByField, IField, CollectType } from '@vikadata/core';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import * as React from 'react';
import styles from '../styles.module.less';
import { CollectTypeSelect } from '../format_date_time/collect_type_select';
import { FieldSelectModal } from '../format_date_time/field_select_modal';

interface IFormatLastModifiedBy {
  currentField: ILastModifiedByField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormatLastModifiedBy: React.FC<IFormatLastModifiedBy> = (props: IFormatLastModifiedBy) => {
  const { currentField, setCurrentField } = props;
  const [isModalShow, setModalShow] = useState(false);

  const handleCollectTypeChange = useCallback((type: number) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        collectType: type,
      } as any,
    });
  }, [currentField, setCurrentField]);

  const handleFieldIdCollectionChange = useCallback((collection: string[]) => {
    setCurrentField({
      ...currentField,
      property: {
        ...currentField.property,
        fieldIdCollection: collection,
      } as any,
    });
  }, [currentField, setCurrentField]);

  const handleCollectTypeSelectedChange = useCallback((type: number) => {
    if (type === CollectType.SpecifiedFields) {
      setModalShow(true);
    }
    handleCollectTypeChange(type);
  }, [handleCollectTypeChange]);

  const handleModalDataChange = useCallback((collection: string[]) => {
    setModalShow(false);
    handleFieldIdCollectionChange(collection);
  }, [handleFieldIdCollectionChange]);

  const handleModalDataCancel = useCallback(() => {
    setModalShow(false);
    if (!currentField.property.fieldIdCollection.length) {
      handleCollectTypeChange(CollectType.AllFields);
    }
  }, [handleCollectTypeChange, currentField]);

  return (
    <div className={styles.section}>
      <CollectTypeSelect field={currentField} onChange={handleCollectTypeSelectedChange} />
      {
        isModalShow && <FieldSelectModal
          field={currentField}
          onCancel={handleModalDataCancel}
          onOk={handleModalDataChange}
        />
      }
    </div>
  );
};
