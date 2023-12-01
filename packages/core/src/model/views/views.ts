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

import { ISnapshot } from '../../exports/store/interfaces';
import { IViewProperty } from '../../exports/store/interfaces';
import { getViewById } from 'modules/database/store/selectors/resource/datasheet/base';
import { Strings, t } from '../../exports/i18n';
import { IBindViewModal } from '.';

/**
 * here's `views` means table view / gallery view, not `view` in table area.
 */
export abstract class View {
  static bindModel: IBindViewModal;
  static getSrcView(snapshot: ISnapshot, activeViewId: string | null | undefined): IViewProperty {
    const views = snapshot.meta.views;
    let srcView: IViewProperty | undefined;
    if (activeViewId) {
      srcView = getViewById(snapshot, activeViewId);
    }

    if (!srcView) {
      srcView = views[0]!;
    }
    return srcView;
  }

  static defaultRows(srcView: IViewProperty) {
    if (srcView) {
      return srcView.rows;
    }
    return [];
  }

  /**
   *  `record` has different name in different view, such as `row`, `record`, `task`, etc.
   * every view need to define their own name of record.
   */
  get recordShowName() {
    return t(Strings.record);
  }

  get recordShowUnit(){
    // TODO: i18n
    return '条';
  }
}
