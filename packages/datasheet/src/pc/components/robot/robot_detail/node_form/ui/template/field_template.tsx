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

import { utils } from '@rjsf/core';
import { Box, Typography, useTheme } from '@apitable/components';
import { IFieldTemplateProps } from '../../core/interface';

const { getSchemaType } = utils;

// Templates for individual field levels.
export const FieldTemplate = (props: IFieldTemplateProps) => {
  const { id, classNames, label, help, required, children, uiSchema, description, errors } = props;
  const schemaType = getSchemaType(props.schema);
  const theme = useTheme();
  const isKV = ['key', 'value'].includes(props.label);
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
    const [, level] = (id || '').split('-');
    // Secondary headings are hidden
    if (isKV || (parseInt(level, 10) === 1 && !showTitle())) {
      return 0;
    }
    return 8;
  })();

  const marginBottom = isKV ? 8 : 0;

  // console.log('errors', errors);
  return (
    <div className={classNames} style={{ width: '100%', paddingTop, marginBottom }}>
      {showTitle() && (
        <Typography variant="h7" color={theme.color.textCommonPrimary} >
          {required ? <span style={{ color: 'red' }}>* </span> : null}
          {label}
        </Typography>
      )}

      <Box padding={'4px 0'}>
        {description}
      </Box>

      {children}
      {errors}
      {help}
    </div>
  );
};
