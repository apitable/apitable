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

import { IFieldProps } from '../../../interface';
import { canExpand } from '../../../utils';
import AddButton from '../../common/AddButton';

export function DefaultObjectFieldTemplate(props: IFieldProps) {
  const { TitleField, DescriptionField } = props;
  return (
    <fieldset id={props.idSchema.$id}>
      {(props.uiSchema['ui:title'] || props.title) && (
        <TitleField
          id={`${props.idSchema.$id}__title`}
          title={props.title || props.uiSchema['ui:title']}
          required={props.required}
          formContext={props.formContext}
        />
      )}
      {props.description && (
        <DescriptionField id={`${props.idSchema.$id}__description`} description={props.description} formContext={props.formContext} />
      )}
      {props.properties.map((prop: any) => prop.content)}
      {canExpand(props.schema, props.uiSchema, props.formData) && (
        <AddButton className="object-property-expand" onClick={props.onAddClick(props.schema)} disabled={props.disabled || props.readonly} />
      )}
    </fieldset>
  );
}
