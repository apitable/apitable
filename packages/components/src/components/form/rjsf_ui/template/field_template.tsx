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

import { FieldTemplateProps } from '@rjsf/core';
import React from 'react';
import { FormItemTitle } from '../common/form_item_title';
import { utils } from '@rjsf/core';

const { getSchemaType } = utils;

export const FieldTemplate = (props: FieldTemplateProps) => {
  const { id, classNames, label, help, required, children, uiSchema } = props;
  const schemaType = getSchemaType(props.schema);
  // const depth = props.id.split('_').length - 1;
  const showTitle = () => {
    let res = schemaType !== 'object';
    if ('ui:options' in uiSchema && 'showTitle' in uiSchema['ui:options']!) {
      res = Boolean(uiSchema['ui:options']?.showTitle);
    }
    return res;
  };
  const paddingTop = (() => {
    if (showTitle()) return 16;
    const [, level] = (id || '').split('-') as [string, string];
    // The secondary title is hidden
    if (parseInt(level, 10) === 1 && !showTitle()) {
      return 0;
    }
    return 8;
  })();

  return (
    <div className={classNames} style={{ width: '100%', paddingTop }}>
      {
        showTitle() && <FormItemTitle>
          <label htmlFor={id}>{label}{required ? '*' : null}</label>
        </FormItemTitle>
      }
      {/* {description} */}
      {children}
      {/* {errors} */}
      {help}
    </div>
  );
};