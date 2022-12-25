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

import { IGridViewColumn, IViewColumn, IViewProperty } from '../../exports/store/interfaces';
import { View } from './views';

export abstract class CardView extends View {
  static defaultColumns(srcView: IViewProperty, columnCount: number) {
    if (!srcView) {
      throw Error('cannot find the source of view');
    }
    let count = 0;
    const columns: IViewColumn[] = (srcView.columns as IGridViewColumn[]).reduce((columns, column) => {
      if (column.hidden || count >= columnCount) {
        columns.push({ ...column, hidden: true });
        return columns;
      }
      count++;
      columns.push({ ...column });
      return columns;
    }, [] as IGridViewColumn[]);

    return columns;
  }

}