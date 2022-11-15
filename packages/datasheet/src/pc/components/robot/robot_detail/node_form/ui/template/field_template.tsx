import { utils } from '@rjsf/core';
import { IFieldTemplateProps } from '../../core/interface';
import { Typography, useTheme } from '@apitable/components';

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
      {
        showTitle() && <Typography variant="h7" color={theme.color.fc2}>
          {required ? <span style={{ color: 'red' }}>* </span> : null}{label}
        </Typography>
      }
      {description}
      {children}
      {errors}
      {help}
    </div>
  );
};
