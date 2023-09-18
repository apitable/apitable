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

import cls from 'classnames';
import { useState } from 'react';
import { isSumLessThanOrEqualTo100 } from 'pc/components/robot/robot_detail/node_form/ui/template/utils';
import { utils } from '../../core';
import { IObjectFieldTemplateProps } from '../../core/interface';
import { getOptions } from '../utils';
import styles from './style.module.less';

const { canExpand } = utils;

const ObjectFieldLayout = (props: IObjectFieldTemplateProps) => {
  const { properties, uiSchema } = props;
  const isInline = Boolean(uiSchema['ui:options']?.inline);
  const layout = uiSchema['ui:options']?.layout;
  const inlineWidths = uiSchema['ui:options']?.inlineWidths as unknown as undefined | string[];
  const marginRight = 8;
  if (layout) {
    return (
      <>
        {(layout as string[][]).map((rowFieldNames, index) => {
          const thisRowFields = properties.filter((ele) => rowFieldNames.includes(ele.name));
          if (thisRowFields.length) {
            const width = isInline ? `${Math.round(100 / thisRowFields.length)}%` : '100%';
            return (
              <div className={cls(styles.inlineObjectChildren, { [styles.inline]: isInline })} key={index}>
                {thisRowFields.map((element, index: number) => (
                  <div
                    key={index} // FIXME: better key
                    style={{ marginRight, width }}
                  >
                    {element.content}
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </>
    );
  }

  const allowCustomWidth = inlineWidths && isInline && inlineWidths.length === properties.length && isSumLessThanOrEqualTo100(inlineWidths);

  const getWidth = (index: number) => {
    if (allowCustomWidth) {
      return inlineWidths[index];
    }
    return isInline ? `${Math.round(100 / properties.length)}%` : '100%';
  };

  return (
    <div className={cls(styles.inlineObjectChildren, { [styles.inline]: isInline })}>
      {properties.map((element: any, index: number) => (
        <div
          key={index} // FIXME: better key
          style={{ marginRight, width: getWidth(index) }}
        >
          {element.content}
        </div>
      ))}
    </div>
  );
};

export const ObjectFieldTemplate = (props: IObjectFieldTemplateProps) => {
  const { title, required, disabled, readonly, uiSchema, idSchema, schema, formData, onAddClick, description } = props;

  const DescriptionField = props.registry.fields.DescriptionField as any;
  const TitleField = props.registry.fields.TitleField as any;
  const hasCollapse = 'ui:options' in uiSchema && 'collapse' in uiSchema['ui:options']!;
  const showTitle = 'ui:options' in uiSchema && 'showTitle' in uiSchema['ui:options']! ? Boolean(uiSchema['ui:options']!['showTitle']) : true;
  const help = getOptions('help', uiSchema).value;
  const defaultCollapse = Boolean(uiSchema['ui:options']?.collapse);
  const [collapse, setCollapse] = useState<boolean>(defaultCollapse);
  // const isInline = Boolean(uiSchema['ui:options']?.inline);
  // if (currentObjectDepth > 3) return null;

  return (
    <div className={styles.objectFieldTemplateWrapper}>
      {(uiSchema['ui:title'] || title) && showTitle && (
        <TitleField
          id={idSchema.$id}
          title={title}
          required={required}
          help={help}
          hasCollapse={hasCollapse}
          onChange={setCollapse}
          defaultCollapse={defaultCollapse}
          style={{ fontSize: 14, fontWeight: 'bold', color: '#636363', paddingTop: 16 }}
        />
      )}
      {description && <DescriptionField id={`${idSchema.$id}-description`} description={description} />}
      {!collapse && (
        <div>
          <ObjectFieldLayout {...props} />
          {canExpand(schema, uiSchema, formData) && <button onClick={onAddClick(schema)} disabled={disabled || readonly} />}
        </div>
      )}
    </div>
  );
};

export default ObjectFieldTemplate;
