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

import { IFormProps } from '../exports/store/interfaces';
import { IJOTAction } from 'engine';
import { OTActionName } from '../engine/ot';
import { isEqual } from 'lodash';

export class FormAction {
  // update own properties
  static updatePropsAction(
    formProps: IFormProps,
    options: {
      partialProps: Partial<IFormProps>
    }
  ): IJOTAction[] {
    const { partialProps } = options;
    const actions: IJOTAction[] = [];
    for (const key in partialProps) {
      const oi = partialProps[key];
      const od = formProps[key];
      if (!isEqual(oi, od)) {
        actions.push({
          n: OTActionName.ObjectReplace,
          p: ['formProps', key],
          oi,
          od,
        });
      }
    }
    return actions;
  }

}
