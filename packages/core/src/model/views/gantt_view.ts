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

import { Settings } from 'config';
import { Field } from 'model/field';
import { BasicValueType } from 'types';
import { integrateCdnHost } from 'utils';
import { Strings, t } from '../../exports/i18n';
import {
  IFieldMap,
  IGanttViewColumn,
  IGanttViewProperty,
  IReduxState,
  ISnapshot,
  IViewProperty,
} from '../../exports/store/interfaces';
import { GanttColorType,
  ViewType
} from 'modules/shared/store/constants';

import { DatasheetActions } from '../../commands_actions/datasheet';
import { View } from './views';

export const DEFAULT_WORK_DAYS = [1, 2, 3, 4, 5];

export class GanttView extends View {
  override get recordShowName() {
    return t(Strings.gantt_task);
  }

  override get recordShowUnit() {
    return '';
  }

  static getViewIntroduce() {
    return {
      title: t(Strings.gantt_view),
      desc: t(Strings.gantt_guide_desc),
      videoGuide: integrateCdnHost(Settings.view_gantt_guide_video.value),
    };
  }

  static findDateTimeFieldIds(srcView: IViewProperty, fieldMap: IFieldMap, state?: IReduxState) {
    const filterIds = srcView.columns.filter(({ fieldId }) => {
      const field = fieldMap[fieldId]!;
      return Field.bindModel(field, state).basicValueType === BasicValueType.DateTime;
    }).map(column => column.fieldId);
    return filterIds;
  }

  static defaultStyle(snapshot: ISnapshot, activeViewId: string | null | undefined, state?: IReduxState) {
    const srcView = this.getSrcView(snapshot, activeViewId);
    const dateTimeFieldIds = this.findDateTimeFieldIds(srcView, snapshot.meta.fieldMap, state);

    return {
      startFieldId: dateTimeFieldIds[0]!,
      endFieldId: dateTimeFieldIds[1] || dateTimeFieldIds[0]!,
      colorOption: {
        type: GanttColorType.Custom,
        fieldId: '',
        color: -1,
      },
      workDays: DEFAULT_WORK_DAYS,
      onlyCalcWorkDay: false,
      linkFieldId: '',
      autoTaskLayout: false
    };
  }

  static defaultColumns(srcView: IViewProperty) {
    if (!srcView) {
      throw Error(t(Strings.error_not_found_the_source_of_view));
    }

    const columns = (srcView.columns as IGanttViewColumn[]).map((column, index) => {
      const fieldId = column.fieldId;
      if (index === 0) {
        return { fieldId };
      }
      return { fieldId, hiddenInGantt: true, hidden: true };
    });

    return columns;
  }

  static generateDefaultProperty(snapshot: ISnapshot, activeViewId: string | null | undefined, state?: IReduxState): IGanttViewProperty {
    const srcView = this.getSrcView(snapshot, activeViewId);
    const views = snapshot.meta.views;

    return {
      id: DatasheetActions.getNewViewId(views),
      name: DatasheetActions.getDefaultViewName(views, ViewType.Gantt),
      type: ViewType.Gantt,
      rowHeightLevel: 1,
      columns: this.defaultColumns(srcView),
      rows: this.defaultRows(srcView),
      frozenColumnCount: 1,
      style: this.defaultStyle(snapshot, activeViewId, state),
      displayHiddenColumnWithinMirror: true
    };
  }

}

