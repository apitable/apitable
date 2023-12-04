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

import { Settings } from 'config/system_config';
import { integrateCdnHost } from 'utils';
import { Field } from 'model/field';
import { BasicValueType } from 'types';
import { Strings, t } from '../../exports/i18n';
import {
  ICalendarViewColumn,
  ICalendarViewProperty,
  ICalendarViewStyle,
  IFieldMap,
  IReduxState,
  ISnapshot,
  IViewProperty,
} from '../../exports/store/interfaces';
import { GanttColorType,ViewType } from 'modules/shared/store/constants';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { View } from './views';

export class CalendarView extends View {

  override get recordShowName() {
    return t(Strings.calendar_record);
  }

  static getViewIntroduce() {
    return {
      title: t(Strings.calendar_view),
      desc: t(Strings.calendar_view_desc),
      videoGuide: integrateCdnHost(Settings.view_calendar_guide_video.value),
    };
  }

  static findDateTimeFieldIds(srcView: IViewProperty, fieldMap: IFieldMap, state?: IReduxState) {
    const filterIds = srcView.columns.filter(({ fieldId }) => {
      const field = fieldMap[fieldId]!;
      return Field.bindModel(field, state).basicValueType === BasicValueType.DateTime;
    }).map(column => column.fieldId);
    return filterIds;
  }

  static defaultStyle(snapshot: ISnapshot, activeViewId: string | null | undefined, state?: IReduxState): ICalendarViewStyle {
    const srcView = this.getSrcView(snapshot, activeViewId);
    const dateTimeFieldIds = this.findDateTimeFieldIds(srcView, snapshot.meta.fieldMap, state);

    return {
      startFieldId: dateTimeFieldIds[0]!,
      endFieldId: dateTimeFieldIds[1]!,
      isColNameVisible: false,
      colorOption: {
        type: GanttColorType.Custom,
        fieldId: '',
        color: -1,
      }
    };
  }

  static defaultColumns(srcView: IViewProperty) {
    if (!srcView) {
      throw Error(t(Strings.error_not_found_the_source_of_view));
    }

    const columns = (srcView.columns as ICalendarViewColumn[]).map((column, index) => {
      const fieldId = column.fieldId;
      if (index === 0) {
        return { fieldId };
      }
      return { fieldId, hiddenInCalendar: true, hidden: true };
    });

    return columns;
  }

  static generateDefaultProperty(snapshot: ISnapshot, activeViewId: string | null | undefined, state?: IReduxState): ICalendarViewProperty {
    const srcView = this.getSrcView(snapshot, activeViewId);
    const views = snapshot.meta.views;

    return {
      id: DatasheetActions.getNewViewId(views),
      name: DatasheetActions.getDefaultViewName(views, ViewType.Calendar),
      type: ViewType.Calendar,
      rowHeightLevel: 1,
      columns: this.defaultColumns(srcView),
      rows: this.defaultRows(srcView),
      frozenColumnCount: 1,
      style: this.defaultStyle(snapshot, activeViewId, state),
      displayHiddenColumnWithinMirror: true
    };
  }

}
