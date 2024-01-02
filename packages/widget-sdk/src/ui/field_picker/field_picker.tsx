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

import { useFields } from '../../hooks';
import React from 'react';
import { DropdownSelect as Select } from '@apitable/components';
import { IFieldPicker, IOption } from 'interface';
import { noop } from 'lodash';
import { Strings, t } from 'core';

/**
 * A field selector component that can select the fields inside the corresponding view ID.
 *
 * @returns
 *
 * #### Example
 *
 * Common usage.
 * ``` ts
 * import React, { useState } from 'react';
 * import { FieldPicker, useActiveViewId } from '@apitable/widget-sdk';
 * const Example = () => {
 *   const viewId = useActiveViewId();
 *   const [fieldId, setFieldId] = useState()
 *   return <FieldPicker viewId={viewId} fieldId={fieldId} onChange={option => setFieldId(option.value)} />
 * }
 * ```
 *
 * Use {@link useCloudStorage} implementing persistent storage.
 * ``` ts
 * import React, { useState } from 'react';
 * import { FieldPicker, useActiveViewId, useCloudStorage } from '@apitable/widget-sdk';
 * const ExampleCloud = () => {
 *   const viewId = useActiveViewId();
 *   const [fieldId, setFieldId] = useCloudStorage('selectFieldId');
 *   return  <FieldPicker viewId={viewId} fieldId={fieldId} onChange={option => setFieldId(option.value)} />;
 * };
 * ```
 *
 */
export function FieldPicker(props: IFieldPicker) {
  const { onChange, fieldId, viewId, placeholder, datasheet, allowedTypes, disabled } = props;
  const hasDatasheet = 'datasheet' in props;
  const datasheetFields = useFields(datasheet, viewId);
  const allFields = useFields(viewId);
  const fields = (hasDatasheet ? datasheetFields : allFields).filter((field) => !allowedTypes || allowedTypes.includes(field.type));

  return (
    <Select
      dropDownOptions={{
        placement: 'bottom-start',
      }}
      panelOptions={{
        maxWidth: '300px',
      }}
      dropdownMatchSelectWidth={false}
      placeholder={placeholder || t(Strings.please_choose)}
      value={fieldId as any}
      options={fields.map((field) => ({ label: field.name, value: field.id }))}
      onSelected={(option) => (onChange ? onChange(option as IOption) : noop)}
      disabled={disabled}
    />
  );
}
