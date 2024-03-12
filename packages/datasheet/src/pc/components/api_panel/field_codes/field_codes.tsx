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
import dynamic from 'next/dynamic';
import * as React from 'react';
import { LinkButton } from '@apitable/components';
import { Field, FieldType, Selectors, Strings, t } from '@apitable/core';
import { Loading } from 'pc/components/common';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import githubIcon from 'static/icon/common/github_octopus.png';
import { getFieldDocs } from '../field_docs/api_panel_config';
import { CodeLanguage, CodeType } from './enum';
import styles from './styles.module.less';

const DocInnerHtml = dynamic(() => import('./doc_inner_html'), {
  ssr: false,
  loading: () => <Loading className={styles.loading} />,
});

export type IFieldValueBase = number | string | boolean | { [key: string]: any };

// Cell value Value type
export type IFieldValue = IFieldValueBase | IFieldValueBase[] | null;

export type IFieldValueMap = { [fieldKey: string]: IFieldValue };

export interface IRecord {
  recordId: string;

  /**
   * Data in record
   * The fieldId key of a column of record will only be available in data if there is content in that column.
   */
  fields: IFieldValueMap;
}

interface IFieldCode {
  language: CodeLanguage;
  setLanguage: (lang: CodeLanguage) => void;
  token: string;
  codeType: CodeType;
  byFieldId?: boolean;
  showApiToken?: boolean;
}

enum RecordType {
  Response,
  Update,
  Add,
}

const API_BASE = 'https://api.vika.cn';
const MORE_SDK_URL = getEnvVariables().API_PANEL_MORE_URL;
const VARIABLE_REG = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

export const FieldCode: React.FC<React.PropsWithChildren<IFieldCode>> = (props) => {
  const { codeType, byFieldId, token, language, setLanguage, showApiToken } = props;
  const datasheetId = useAppSelector(Selectors.getActiveDatasheetId)!;
  const viewId = useAppSelector(Selectors.getActiveViewId)!;
  const columns = useAppSelector(Selectors.getVisibleColumns)!;
  const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, state.pageParams.datasheetId!))!;
  const rows = useAppSelector((state) => Selectors.getVisibleRows(state))!;
  const snapshot = useAppSelector(Selectors.getSnapshot)!;
  // const uploadTip = codeType === CodeType.Upload ? t(Strings.api_upload_tip) : null;

  const getAttachmentFieldName = () => {
    const attachmentColumn = columns.find((field) => fieldMap[field.fieldId].type === FieldType.Attachment);
    if (attachmentColumn) {
      const attachmentField = fieldMap[attachmentColumn.fieldId];
      return byFieldId ? attachmentField.id : attachmentField.name;
    }
    return '<attachment field>';
  };

  const getInvalidFieldNames = () => {
    const invalidFieldNames = columns
      .filter((field) => !VARIABLE_REG.test(fieldMap[field.fieldId].name))
      .map((field) => fieldMap[field.fieldId].name);
    return invalidFieldNames;
  };
  const hasInvalidFieldNames = () => {
    return Boolean(getInvalidFieldNames().length);
  };

  const getExampleRecords = (type: RecordType): Partial<IRecord>[] => {
    return rows
      .slice(0, 10)
      .map((row) => {
        const fields = {};
        columns.forEach((column) => {
          const field = fieldMap[column.fieldId];
          const cellValue = Selectors.getCellValue(store.getState(), snapshot, row.recordId, field.id);
          const apiValue = Field.bindModel(field).cellValueToApiStandardValue(cellValue);
          if (apiValue != null) {
            switch (type) {
              case RecordType.Add:
              case RecordType.Update:
                // Fields can only be written when they are editable.
                if (Field.bindModel(field).recordEditable()) {
                  // Empty values are not displayed
                  fields[byFieldId ? field.id : field.name] = apiValue;
                }
                break;
              default:
                fields[byFieldId ? field.id : field.name] = apiValue;
                break;
            }
          }
        });
        if (type === RecordType.Add) {
          return { fields };
        }
        return {
          recordId: row.recordId,
          fields,
        };
      })
      .filter((record) => Object.keys(record.fields).length)
      .slice(0, 2);
  };

  const exampleResponseRecords = getExampleRecords(RecordType.Response) as IRecord[];
  const exampleAddRecords = getExampleRecords(RecordType.Add) as IRecord[];
  const exampleUpdateRecords = getExampleRecords(RecordType.Update);
  const exampleDeleteRecords = exampleResponseRecords.map((r) => r.recordId);

  const getExampleRecordKV = (isWriteMode?: boolean) => {
    const exampleRecords = isWriteMode ? exampleAddRecords : exampleResponseRecords;
    if (!exampleRecords.length)
      return {
        oneRecord: {
          recordId: 'null',
          fields: {},
        },
        oneFieldKey: 'null',
        oneFieldValue: 'null',
      };
    const oneRecord = exampleRecords[0];
    const oneFieldKey = Object.keys(oneRecord.fields)[0];
    const oneFieldValue = oneRecord.fields[oneFieldKey];

    return {
      oneRecord,
      oneFieldKey,
      oneFieldValue,
    };
  };
  // Assemble the search criteria
  const getSearchParams = (type?: 'get' | 'add' | 'update' | 'bulk_add') => {
    const { oneFieldKey, oneFieldValue, oneRecord } = getExampleRecordKV(true);

    switch (type) {
      case 'get':
        return `${oneFieldKey}=${JSON.stringify(oneFieldValue, null, 2)}`;
      case 'add':
        return JSON.stringify(exampleAddRecords[0]?.fields, null, 2);
      case 'bulk_add':
        return JSON.stringify(
          exampleAddRecords.map((record) => record.fields),
          null,
          2,
        );
      case 'update':
        return JSON.stringify(oneRecord.fields, null, 2);
      default:
        return '';
    }
  };

  const recordsWithResBody = (records: IRecord[], withPagination?: boolean) => {
    let data: any = { records };
    if (withPagination) {
      data = {
        total: rows.length,
        pageNum: 1,
        pageSize: rows.length > 100 ? 100 : rows.length,
        records,
      };
    }
    return {
      code: 200,
      success: true,
      message: 'Request successful',
      data: data,
    };
  };

  const getExampleConfig = () => {
    const commonContext = {
      apiToken: token,
      githubIcon: githubIcon.src,
      datasheetId,
      res: '',
      tips: '',
      fieldKey: byFieldId ? 'id' : 'name',
      apiBase: window.location.origin.includes('vika.cn') ? API_BASE : window.location.origin,
      viewId,
      pyGetParams: getSearchParams('get'),
      fieldNameTips: !byFieldId && hasInvalidFieldNames() ? t(Strings.field_map_tips_for_python) : '',
    };

    switch (codeType) {
      case CodeType.Get: {
        return {
          ...commonContext,
          method: 'GET',
          response: JSON.stringify(recordsWithResBody(exampleResponseRecords, true), null, 2),
        };
      }

      case CodeType.Add: {
        return {
          ...commonContext,
          method: 'POST',
          records: JSON.stringify(exampleAddRecords, null, 2),
          response: JSON.stringify(recordsWithResBody(exampleResponseRecords), null, 2),
          addParams: getSearchParams('add'),
          bulkAddParams: getSearchParams('bulk_add'),
          exampleRecords: exampleAddRecords,
        };
      }
      case CodeType.Update: {
        const { oneFieldKey, oneFieldValue } = getExampleRecordKV();
        return {
          ...commonContext,
          method: 'PATCH',
          records: JSON.stringify(exampleUpdateRecords, null, 2),
          response: JSON.stringify(recordsWithResBody(exampleResponseRecords), null, 2),
          updateParams: getSearchParams('update'),
          oneFieldKey,
          oneFieldValue: JSON.stringify(oneFieldValue, null, 2),
          oneRecordId: exampleUpdateRecords[0] ? exampleUpdateRecords[0].recordId : null,
          exampleRecords: exampleUpdateRecords,
        };
      }
      case CodeType.Delete: {
        return {
          ...commonContext,
          method: 'DELETE',
          recordIds: JSON.stringify(exampleDeleteRecords, null, 2),
          response: true,
          deleteParams: exampleDeleteRecords.map((recordId) => `recordIds=${recordId}`).join('&'),
          exampleRecords: exampleDeleteRecords,
        };
      }
      case CodeType.Upload:
      default: {
        const defaultExampleId = getFieldDocs(FieldType.Attachment).defaultExampleId;
        return {
          ...commonContext,
          method: 'UPLOAD',
          data: '{Your file path}',
          response: JSON.parse(defaultExampleId ? t(Strings[defaultExampleId]) : '{}'),
          attachFieldName: getAttachmentFieldName(),
        };
      }
    }
  };

  const exampleConfig = getExampleConfig();

  return (
    <div className={styles.fieldCodes}>
      <div className={styles.radioGroup}>
        <LinkButton
          underline={false}
          component="button"
          className={classNames({ [styles.radioActive]: CodeLanguage.Curl === language })}
          onClick={() => setLanguage(CodeLanguage.Curl)}
        >
          cURL
        </LinkButton>
        <LinkButton
          underline={false}
          component="button"
          className={classNames({ [styles.radioActive]: CodeLanguage.Js === language })}
          onClick={() => setLanguage(CodeLanguage.Js)}
        >
          JavaScript
        </LinkButton>
        <LinkButton
          underline={false}
          component="button"
          className={classNames({ [styles.radioActive]: CodeLanguage.Python === language })}
          onClick={() => setLanguage(CodeLanguage.Python)}
        >
          Python
        </LinkButton>
        {MORE_SDK_URL && (
          <LinkButton
            underline={false}
            component="button"
            onClick={() => {
              window.open(MORE_SDK_URL, '_blank');
            }}
          >
            More
          </LinkButton>
        )}
      </div>
      <DocInnerHtml showApiToken={showApiToken} exampleConfig={exampleConfig} language={language} />
    </div>
  );
};
