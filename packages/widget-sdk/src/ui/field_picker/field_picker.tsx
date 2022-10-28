import { useFields } from '../../hooks';
import React from 'react';
import { Select } from '@vikadata/components';
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
 * import { FieldPicker, useActiveViewId } from '@vikadata/widget-sdk';
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
 * import { FieldPicker, useActiveViewId, useCloudStorage } from '@vikadata/widget-sdk';
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
  const fields = (hasDatasheet ? datasheetFields : allFields).filter(field => !allowedTypes || allowedTypes.includes(field.type));

  return (
    <Select
      placeholder={placeholder || t(Strings.please_choose)}
      value={fieldId as any}
      options={fields.map(field => ({ label: field.name, value: field.id }))}
      onSelected={option => onChange ? onChange(option as IOption) : noop}
      disabled={disabled}
    />
  );
}
