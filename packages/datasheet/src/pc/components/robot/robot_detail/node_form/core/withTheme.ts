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
      ref,
    });
  });
}

export default withTheme;

// const withTheme = () => null;
// export default withTheme;
