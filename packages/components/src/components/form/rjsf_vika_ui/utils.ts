import { ObjectFieldTemplateProps, UiSchema } from '@rjsf/core';

export const getObjectDepth = (props: ObjectFieldTemplateProps): number => {
  const { idSchema } = props;
  const ids = idSchema.$id.split('_');
  return ids.length - 1;
};

export const getOptions = (key: string, uiSchema: UiSchema): {
  has: boolean,
  value?: any,
} => {
  if ('ui:options' in uiSchema && key in uiSchema['ui:options']!) {
    return {
      has: true,
      value: uiSchema['ui:options']![key]
    };
  }
  return {
    has: false,
  };
};