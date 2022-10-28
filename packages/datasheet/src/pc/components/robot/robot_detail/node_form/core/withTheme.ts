import { createElement, forwardRef } from 'react';
import { Form } from './components/Form';

interface IWithThemeProps {
  widgets: any[];
  fields: any[];
}
function withTheme(themeProps: IWithThemeProps) {
  return forwardRef(({ fields, widgets, ...directProps }: any, ref) => {
    fields = { ...themeProps.fields, ...fields };
    widgets = { ...themeProps.widgets, ...widgets };

    return createElement(Form, {
      ...themeProps,
      ...directProps,
      fields,
      widgets,
      ref
    });
  });
}

export default withTheme;

// const withTheme = () => null;
// export default withTheme;