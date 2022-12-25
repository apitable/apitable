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

export default class Enum {
  private readonly props: { [key: string | number]: { key: string, value: any, [key: string]: any } };
  constructor(props: { key: string, value: any, [key: string]: any }[] = []) {
    this.props = {};
    if (props.length) {
      props.forEach(element => {
        if (element.key && element.value) {
          this[element.key] = element.value;
          this.props[element.value] = element;
        }
      });
    }
  }

  /**
   * get object from value
   * @param {string|number} value status
   */
  get(value: string | number) {
    return this.props[value];
  }

  /**
   * get array from enum
   */
  getArray() {
    const arr = [];
    for (const key in this.props) {
      if (Object.prototype.hasOwnProperty.call(this.props, key)) {
        arr.push(this.props[key]);
      }
    }
    return arr;
  }
}
