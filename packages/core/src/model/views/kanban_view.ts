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
import { Strings, t } from '../../exports/i18n';
import { DatasheetActions } from 'commands_actions/datasheet';
import { IFieldMap, IKanbanViewProperty, ISnapshot } from '../../exports/store/interfaces';
import { ViewType } from 'modules/shared/store/constants';
import { IViewColumn, IViewProperty } from '../../exports/store/interfaces';
import { FieldType, IField, IMemberProperty } from 'types';
import { CardView } from './card_view';
import { integrateCdnHost } from 'utils';

export class KanbanView extends CardView {

  static findGroupFieldId(srcView: IViewProperty, fieldMap: IFieldMap) {
    const column = srcView.columns.find(item => {
      const field = fieldMap[item.fieldId]!;
      return field.type === FieldType.SingleSelect ||
        (field.type === FieldType.Member && !field.property.isMulti);
    });
    return column?.fieldId;
  }

  static getFieldProperty(column: IViewColumn | undefined, fieldMap: IFieldMap) {
    if (!column) {
      return [];
    }
    const field = fieldMap[column.fieldId]!;
    if (field.type === FieldType.Member) {
      return field.property.unitIds;
    }
    if (field.type === FieldType.SingleSelect) {
      return field.property.options.map(item => item.id);
    }
    return [];

  }

  static getHiddenGroupMap(field: IField | undefined) {
    if (!field) {
      return;
    }

    const hiddenGroupMap = {};

    if (field.type === FieldType.SingleSelect) {
      field.property.options.forEach(item => {
        hiddenGroupMap[item.id] = false;
      });
    } else {
      (field.property as IMemberProperty).unitIds.forEach(id => {
        hiddenGroupMap[id] = false;
      });
    }

    return hiddenGroupMap;
  }

  static defaultStyle(snapshot: ISnapshot, activeViewId: string) {
    const srcView = this.getSrcView(snapshot, activeViewId);

    // the first attachment field will be default cover field

    const kanbanFieldId = this.findGroupFieldId(srcView, snapshot.meta.fieldMap)!;
    const field = snapshot.meta.fieldMap[kanbanFieldId];

    return {
      isCoverFit: false,
      coverFieldId: undefined,
      kanbanFieldId,
      isColNameVisible: true,
      hiddenGroupMap: KanbanView.getHiddenGroupMap(field),
    };
  }

  static generateDefaultProperty(snapshot: ISnapshot, activeViewId: string | null | undefined): IKanbanViewProperty {
    const srcView = this.getSrcView(snapshot, activeViewId);
    const views = snapshot.meta.views;
    return {
      id: DatasheetActions.getNewViewId(views),
      name: DatasheetActions.getDefaultViewName(views, ViewType.Kanban),
      type: ViewType.Kanban,
      columns: this.defaultColumns(srcView, 2),
      rows: this.defaultRows(srcView),
      style: this.defaultStyle(snapshot, activeViewId!),
      groupInfo: [{ fieldId: this.findGroupFieldId(srcView, snapshot.meta.fieldMap)!, desc: false }],
      displayHiddenColumnWithinMirror: true
    };
  }

  static getViewIntroduce() {
    return {
      title: t(Strings.kanban_view),
      desc: t(Strings.kanban_guide_desc),
      videoGuide: integrateCdnHost(Settings.view_kanban_guide_video.value),
    };
  }
}
