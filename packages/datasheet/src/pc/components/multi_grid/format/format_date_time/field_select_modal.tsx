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

import { useState, useMemo } from 'react';
import * as React from 'react';
import { Button, TextButton, Switch } from '@apitable/components';
import { IDateTimeBaseField, Selectors, IViewColumn, Strings, t, ILastModifiedByField, FieldType } from '@apitable/core';
import { BaseModal } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { LineSearchInput } from 'pc/components/list/common_list/line_search_input';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './styles.module.less';

interface IFieldSelectModalProps {
  field: IDateTimeBaseField | ILastModifiedByField;
  onCancel: (isModalShow: boolean) => void;
  onOk: (collection: string[]) => void;
}

export const FieldSelectModal: React.FC<React.PropsWithChildren<IFieldSelectModalProps>> = (props: IFieldSelectModalProps) => {
  const { onCancel, onOk, field: currentField } = props;
  const currentFieldId = currentField.id;
  const fieldIdCollection = currentField.property.fieldIdCollection!;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const activeView = useAppSelector((state) => Selectors.getCurrentView(state))!;
  const columns: IViewColumn[] = activeView.columns;
  const [collection, setCollection] = useState([...fieldIdCollection]);
  const [query, setQuery] = useState('');

  // Exclude current fields, computed fields, and field types that cannot be edited
  const filteredColumns = useMemo(() => {
    const computedFields = new Set([
      FieldType.Formula,
      FieldType.LookUp,
      FieldType.CreatedTime,
      FieldType.LastModifiedTime,
      FieldType.CreatedBy,
      FieldType.LastModifiedBy,
      FieldType.AutoNumber,
    ]);
    return columns.filter((column) => {
      const columnFieldId = column.fieldId;
      const columnFieldType = fieldMap[columnFieldId].type;
      return columnFieldId !== currentFieldId && !computedFields.has(columnFieldType);
    });
  }, [columns, fieldMap, currentFieldId]);

  const searchedColumns = useMemo(() => {
    return filteredColumns.filter((column) => fieldMap[column.fieldId].name.includes(query));
  }, [fieldMap, filteredColumns, query]);

  const onCancelHandler = () => {
    onCancel(false);
  };

  const onOkHandler = () => {
    onOk(collection);
  };

  const onChange = (fieldId: string) => {
    const newCollection = collection.includes(fieldId) ? collection.filter((id) => id !== fieldId) : [...collection, fieldId];
    setCollection(newCollection);
  };

  const setAllFieldsHandler = () => {
    const newCollection = filteredColumns.map((column) => column.fieldId);
    setCollection(newCollection);
  };

  const renderFooter = () => {
    return (
      <div className={styles.modalFooter}>
        <div className={styles.left}>
          <Button size="small" onClick={() => setCollection([])}>
            {t(Strings.clear_all_fields)}
          </Button>
          <Button className={styles.button} size="small" onClick={setAllFieldsHandler}>
            {t(Strings.select_all_fields)}
          </Button>
        </div>
        <div className={styles.right}>
          <TextButton size="small" onClick={onCancelHandler}>
            {t(Strings.cancel)}
          </TextButton>
          <Button color="primary" size="small" onClick={onOkHandler} disabled={!collection.length}>
            {t(Strings.submit)}
          </Button>
        </div>
      </div>
    );
  };

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const SelectedFieldItem = ({ fieldId }: { fieldId: string }) => {
    if (!fieldMap[fieldId]) {
      return <></>;
    }
    return (
      <div
        key={fieldId}
        className={styles.fieldItem}
        onClick={() => {
          onChange(fieldId);
        }}
      >
        <div className={styles.fieldIconAndTitle}>
          <div className={styles.iconType}>{getFieldTypeIcon(fieldMap[fieldId].type)}</div>
          <div className={styles.fieldName}>{fieldMap[fieldId].name}</div>
        </div>
        <Switch checked={collection.includes(fieldId)} size={isMobile ? 'default' : 'small'} />
      </div>
    );
  };

  const modalDesc = useMemo(() => {
    return currentField.type === FieldType.LastModifiedBy
      ? t(Strings.last_modified_by_select_modal_desc)
      : t(Strings.last_modified_time_select_modal_desc);
  }, [currentField]);

  const Content = (
    <>
      <div className={styles.desc}>{modalDesc}</div>
      <div className={styles.searchField}>
        <LineSearchInput placeholder={t(Strings.search_field)} onChange={(e) => setQuery(e.target.value)} value={query} />
      </div>
      <div className={styles.fieldListWrapper}>
        {searchedColumns.length ? (
          <div className={styles.fieldList}>
            {searchedColumns.map((column) => (
              <SelectedFieldItem fieldId={column.fieldId} key={column.fieldId} />
            ))}
          </div>
        ) : (
          <div className={styles.noResult}>{t(Strings.no_search_result)}</div>
        )}
      </div>
    </>
  );

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <BaseModal
          title={t(Strings.field_select_modal_title)}
          width={480}
          closable={false}
          onOk={onOkHandler}
          onCancel={onCancelHandler}
          footer={renderFooter()}
        >
          <div className={styles.modelBody}>{Content}</div>
        </BaseModal>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          open
          onClose={onCancelHandler}
          title={t(Strings.field_select_modal_title)}
          height="90%"
          footer={
            <Button color="primary" size="large" block onClick={onOkHandler} disabled={!collection.length}>
              {t(Strings.submit)}
            </Button>
          }
        >
          <div className={styles.flowBox}>
            {Content}
            <div className={styles.btnGroup}>
              <Button size="large" onClick={() => setCollection([])} block>
                {t(Strings.clear_all_fields)}
              </Button>
              <Button size="large" onClick={setAllFieldsHandler} block>
                {t(Strings.select_all_fields)}
              </Button>
            </div>
          </div>
        </Popup>
      </ComponentDisplay>
    </>
  );
};
