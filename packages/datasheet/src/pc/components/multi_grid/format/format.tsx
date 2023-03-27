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

import { SetStateAction } from 'react';
import * as React from 'react';
import { FieldType, IDateTimeBaseField, IField } from '@apitable/core';
import { FormatSelect } from './format_select/format_select';
import { Dispatch } from 'react';
import { FormateNumber } from './format_number';
import { FormatDateTime } from './format_date_time';
import { FormateLink } from './format_link/format_link';
import { FormateRating } from './format_rating';
import { FormateCheckbox } from './format_checkbox';
import { FormatFormula } from './format_formula';
import { FormateLookUp } from './format_lookup';
import { FormatMember } from './format_member';
import { FormatSingleText } from './format_single_text';
import { FormatLastModifiedBy } from './format_last_modified_by';
import { FormatURL } from './format_url';

interface IFieldFormatProps {
  from?: string;
  currentField: IField;
  setCurrentField: Dispatch<SetStateAction<IField>>;
  hideOperateBox: () => void;
  datasheetId?: string;
}

export const FieldFormat: React.FC<React.PropsWithChildren<IFieldFormatProps>> = props => {
  const { from, currentField, setCurrentField, hideOperateBox, datasheetId } = props;

  if (!currentField.property && (currentField.type === FieldType.SingleSelect || currentField.type === FieldType.MultiSelect)) {
    setCurrentField({
      ...currentField,
      property: {
        options: [],
      },
    });
  }

  switch (currentField.type) {
    case FieldType.Text:
    case FieldType.AutoNumber:
    case FieldType.CreatedBy:
      return <></>;
    case FieldType.Rating:
      return <FormateRating currentField={currentField} setCurrentField={setCurrentField} />;
    case FieldType.Checkbox:
      return <FormateCheckbox currentField={currentField} setCurrentField={setCurrentField} />;
    case FieldType.Number:
    case FieldType.Currency:
    case FieldType.Percent:
      return <FormateNumber currentField={currentField} setCurrentField={setCurrentField} datasheetId={datasheetId} />;
    case FieldType.SingleSelect:
    case FieldType.MultiSelect:
      return (
        <FormatSelect
          currentField={currentField}
          setCurrentField={setCurrentField}
          isMulti={currentField.type === FieldType.MultiSelect}
          datasheetId={datasheetId}
        />
      );
    case FieldType.DateTime:
    case FieldType.CreatedTime:
    case FieldType.LastModifiedTime:
      return <FormatDateTime currentField={currentField} setCurrentField={setCurrentField as  React.Dispatch<SetStateAction<IDateTimeBaseField>>} />;
    case FieldType.Link:
      return <FormateLink currentField={currentField} setCurrentField={setCurrentField} hideOperateBox={hideOperateBox} datasheetId={datasheetId} />;
    case FieldType.Formula:
      return <FormatFormula from={from} currentField={currentField} setCurrentField={setCurrentField} datasheetId={datasheetId} />;
    case FieldType.LookUp:
      return <FormateLookUp currentField={currentField} setCurrentField={setCurrentField} datasheetId={datasheetId} />;
    case FieldType.Member:
      return <FormatMember currentField={currentField} setCurrentField={setCurrentField} />;
    case FieldType.SingleText:
      return <FormatSingleText currentField={currentField} setCurrentField={setCurrentField} />;
    case FieldType.LastModifiedBy:
      return <FormatLastModifiedBy currentField={currentField} setCurrentField={setCurrentField} />;
    case FieldType.URL:
      return <FormatURL currentField={currentField} setCurrentField={setCurrentField} />;
    default:
      return <></>;
  }
};
