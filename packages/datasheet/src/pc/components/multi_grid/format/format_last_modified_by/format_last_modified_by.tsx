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

import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import * as React from 'react';
import { ILastModifiedByField, IField, CollectType } from '@apitable/core';
import { CollectTypeSelect } from '../format_date_time/collect_type_select';
import { FieldSelectModal } from '../format_date_time/field_select_modal';
import styles from '../styles.module.less';

interface IFormatLastModifiedBy {
  currentField: ILastModifiedByField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
}

export const FormatLastModifiedBy: React.FC<React.PropsWithChildren<IFormatLastModifiedBy>> = (props: IFormatLastModifiedBy) => {
  const { currentField, setCurrentField } = props;
  const [isModalShow, setModalShow] = useState(false);

  const handleCollectTypeChange = useCallback(
    (type: number) => {
      setCurrentField({
        ...currentField,
        property: {
          ...currentField.property,
          collectType: type,
        } as any,
      });
    },
    [currentField, setCurrentField],
  );

  const handleFieldIdCollectionChange = useCallback(
    (collection: string[]) => {
      setCurrentField({
        ...currentField,
        property: {
          ...currentField.property,
          fieldIdCollection: collection,
        } as any,
      });
    },
    [currentField, setCurrentField],
  );

  const handleCollectTypeSelectedChange = useCallback(
    (type: number) => {
      if (type === CollectType.SpecifiedFields) {
        setModalShow(true);
      }
      handleCollectTypeChange(type);
    },
    [handleCollectTypeChange],
  );

  const handleModalDataChange = useCallback(
    (collection: string[]) => {
      setModalShow(false);
      handleFieldIdCollectionChange(collection);
    },
    [handleFieldIdCollectionChange],
  );

  const handleModalDataCancel = useCallback(() => {
    setModalShow(false);
    if (!currentField.property.fieldIdCollection.length) {
      handleCollectTypeChange(CollectType.AllFields);
    }
  }, [handleCollectTypeChange, currentField]);

  return (
    <div className={styles.section}>
      <CollectTypeSelect field={currentField} onChange={handleCollectTypeSelectedChange} />
      {isModalShow && <FieldSelectModal field={currentField} onCancel={handleModalDataCancel} onOk={handleModalDataChange} />}
    </div>
  );
};
