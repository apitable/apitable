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

import { View } from './views';
import { Strings, t } from '../../exports/i18n';
import { DatasheetActions } from '../datasheet';
import {
  ICalendarViewColumn, ICalendarViewProperty, IFieldMap, ISetCalendarStyle, ISnapshot, IViewProperty,
  CalendarColorType, ViewType
} from '../../exports/store';
import { BasicValueType } from 'types';
import { Field } from 'model';
import { getViewIndex } from '../../exports/store/selectors';
import { IJOTAction, integrateCdnHost, OTActionName, Settings } from 'index';

export class CalendarView extends View {

  override get recordShowName(){
    return t(Strings.calendar_record);
  }

  static getViewIntroduce() {
    return {
      title: t(Strings.calendar_view),
      desc: t(Strings.calendar_view_desc),
      videoGuide: integrateCdnHost(Settings.view_calendar_guide_video.value),
    };
  }

  static findDateTimeFieldIds(srcView: IViewProperty, fieldMap: IFieldMap) {
    const filterIds = srcView.columns.filter(({ fieldId }) => {
      const field = fieldMap[fieldId]!;
      return Field.bindModel(field).basicValueType === BasicValueType.DateTime;
    }).map(column => column.fieldId);
    return filterIds;
  }

  static defaultStyle(snapshot: ISnapshot, activeViewId: string | null | undefined) {
    const srcView = this.getSrcView(snapshot, activeViewId);
    const dateTimeFieldIds = this.findDateTimeFieldIds(srcView, snapshot.meta.fieldMap);

    return {
      startFieldId: dateTimeFieldIds[0],
      endFieldId: dateTimeFieldIds[1],
      isColNameVisible: false,
      colorOption: {
        type: CalendarColorType.Custom,
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

  static generateDefaultProperty(snapshot: ISnapshot, activeViewId: string | null | undefined): any {
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
      style: this.defaultStyle(snapshot, activeViewId),
    };
  }

  static setCalendarStyle2Action = (snapshot: ISnapshot, payload: { viewId: string, data: ISetCalendarStyle[], isClear?: boolean }): IJOTAction[] => {
    const { viewId, data, isClear } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) return [];
    const view = snapshot.meta.views[viewIndex] as ICalendarViewProperty;
    if (view.type !== ViewType.Calendar) return [];

    return data.filter(({ styleKey, styleValue }) => {
      return styleValue !== view.style[styleKey];
    }).map(({ styleKey, styleValue }) => {
      if (isClear) {
        return {
          n: OTActionName.ObjectDelete,
          p: ['meta', 'views', viewIndex, 'style', styleKey],
          od: view.style[styleKey],
        };
      }
      return {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', viewIndex, 'style', styleKey],
        oi: styleValue,
        od: view.style[styleKey],
      };
    });
  };
}
