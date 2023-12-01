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

import { Strings, t } from '../../exports/i18n';
import { ViewType } from '../../modules/shared/store/constants';
import { IGridViewProperty, ISnapshot, IViewColumn, IViewProperty } from '../../exports/store/interfaces';
import { getViewById } from 'modules/database/store/selectors/resource/datasheet/base';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { View } from './views';
import { Settings } from 'config';
import { integrateCdnHost } from 'utils';

export class GridView extends View {
  override get recordShowName() {
    return t(Strings.row);
  }

  override get recordShowUnit() {
    return '';
  }

  static generateDefaultProperty(snapshot: ISnapshot, activeViewId: string | null | undefined): IGridViewProperty {
    const views = snapshot.meta.views;
    let srcView: IViewProperty | undefined;
    if (activeViewId) {
      srcView = getViewById(snapshot, activeViewId);
    }

    if (!srcView) {
      srcView = views[0];
    }
    let columns: IViewColumn[];

    if (srcView) {
      if (srcView.type === ViewType.Grid) {
        columns = srcView.columns.map(item => {
          return { fieldId: item.fieldId, width: item.width };
        });
      } else {
        columns = (srcView.columns as IViewColumn[]).map(item => {
          return { fieldId: item.fieldId };
        });
      }
    } else {
      throw Error(t(Strings.error_not_found_the_source_of_view));
    }

    return {
      id: DatasheetActions.getNewViewId(views),
      name: DatasheetActions.getDefaultViewName(views, ViewType.Grid),
      type: ViewType.Grid,
      rowHeightLevel: 1,
      columns,
      rows: this.defaultRows(srcView),
      frozenColumnCount: 1,
      displayHiddenColumnWithinMirror: false
    };
  }

  static getViewIntroduce() {
    return {
      title: t(Strings.grid_view),
      desc: t(Strings.grid_guide_desc),
      videoGuide: integrateCdnHost(Settings.view_grid_guide_video.value),
    };
  }
}
