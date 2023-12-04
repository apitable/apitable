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

import { IReduxState } from 'exports/store/interfaces';
import { Store } from 'redux';
import { FieldType, IField } from 'types';

export class Field {
  constructor(private readonly field: IField, private readonly store: Store<IReduxState>) {}

  get id(): string {
    return this.field.id;
  }

  get name(): string {
    return this.field.name;
  }

  get type(): FieldType {
    return this.field.type;
  }

  /**
   * Get the view object of the field via `transform`.
   */
  getViewObject<R>(transform: (field: IField, options: IFieldVoTransformOptions) => R): R {
    return transform(this.field, { state: this.store.getState() });
  }
}

/**
 * The options for the field view object transformer function.
 */
export interface IFieldVoTransformOptions {
  state: IReduxState
}