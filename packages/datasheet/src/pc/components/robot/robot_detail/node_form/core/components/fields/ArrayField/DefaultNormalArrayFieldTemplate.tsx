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

import AddButton from '../../common/AddButton';
import { ArrayFieldDescription } from './ArrayFieldDescription';
import { ArrayFieldTitle } from './ArrayFieldTitle';
import { DefaultArrayItem } from './DefaultArrayItem';

export function DefaultNormalArrayFieldTemplate(props: any) {
  return (
    <fieldset className={props.className} id={props.idSchema.$id}>
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={props.uiSchema['ui:title'] || props.title}
        required={props.required}
      />

      {(props.uiSchema['ui:description'] || props.schema.description) && (
        <ArrayFieldDescription
          key={`array-field-description-${props.idSchema.$id}`}
          DescriptionField={props.DescriptionField}
          idSchema={props.idSchema}
          description={props.uiSchema['ui:description'] || props.schema.description}
        />
      )}

      <div className="row array-item-list" key={`array-item-list-${props.idSchema.$id}`}>
        {props.items && props.items.map((p: any) => DefaultArrayItem(p))}
      </div>

      {props.canAdd && <AddButton className="array-item-add" onClick={props.onAddClick} disabled={props.disabled || props.readonly} />}
    </fieldset>
  );
}
