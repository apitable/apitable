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
    const [, level] = (id || '').split('-');
    // 2 级标题被隐藏
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