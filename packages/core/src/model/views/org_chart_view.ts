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
import { IOrgChartViewProperty, ISnapshot, IViewProperty, IOrgChartViewColumn } from '../../exports/store/interfaces';
import { getViewById } from 'modules/database/store/selectors/resource/datasheet/base';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { View } from './views';
import { Settings } from 'config';
import { integrateCdnHost } from 'utils';
import { FieldType } from 'types/field_types';

export class OrgChartView extends View {
  override get recordShowName() {
    return t(Strings.row);
  }

  override get recordShowUnit() {
    return '';
  }

  static defaultStyle(snapshot: ISnapshot, srcView: IViewProperty) {

    // the first attachment field set as default cover field
    const initCoverField = srcView.columns.find(col =>
      snapshot.meta.fieldMap[col.fieldId]!.type === FieldType.Attachment,
    );

    const linkField = srcView.columns.find(col => {
      const field = snapshot.meta.fieldMap[col.fieldId]!;
      return field.type === FieldType.Link && field.property.foreignDatasheetId === snapshot.datasheetId;
    })!;

    return {
      isCoverFit: false,
      coverFieldId: initCoverField?.fieldId,
      isColNameVisible: true,
      linkFieldId: linkField?.fieldId,
      horizontal: false,
    };
  }

  static defaultColumns(srcView: IViewProperty) {
    if (!srcView) {
      throw Error(t(Strings.error_not_found_the_source_of_view));
    }

    const columns = (srcView.columns as IOrgChartViewColumn[]).map((column, index) => {
      const fieldId = column.fieldId;
      if (index === 0) {
        return { fieldId };
      }
      return { fieldId, hiddenInOrgChart: true, hidden: true };
    });

    return columns;
  }

  static generateDefaultProperty(snapshot: ISnapshot, activeViewId: string | null | undefined): IOrgChartViewProperty {
    const views = snapshot.meta.views;
    let srcView: IViewProperty | undefined;
    if (activeViewId) {
      srcView = getViewById(snapshot, activeViewId);
    }

    if (!srcView) {
      srcView = views[0]!;
    }

    return {
      id: DatasheetActions.getNewViewId(views),
      name: DatasheetActions.getDefaultViewName(views, ViewType.OrgChart),
      type: ViewType.OrgChart,
      columns: this.defaultColumns(srcView),
      rows: this.defaultRows(srcView),
      style: this.defaultStyle(snapshot, srcView),
      displayHiddenColumnWithinMirror: true
    };
  }

  static getViewIntroduce() {
    return {
      title: t(Strings.org_chart_view),
      desc: t(Strings.org_guide_desc),
      videoGuide: integrateCdnHost(Settings.view_architecture_guide_video.value),
    };
  }
}
