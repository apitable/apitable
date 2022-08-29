import { Settings } from 'config';
import { IJOTAction, OTActionName } from 'engine';
import { Strings, t } from 'i18n';
import { DatasheetActions } from 'model';
import { IFieldMap, IKanbanViewProperty, ISetKanbanStyleValue, ISnapshot, ViewType } from 'store';
import { IViewColumn, IViewProperty } from 'store/interface';
import { getViewIndex } from 'store/selector';
import { FieldType, IField } from 'types';
import { CardView } from './card_view';
import { integrateCdnHost } from 'utils';

export class KanbanView extends CardView {

  static findGroupFieldId(srcView: IViewProperty, fieldMap: IFieldMap) {
    const column = srcView.columns.find(item => {
      const field = fieldMap[item.fieldId];
      return field.type === FieldType.SingleSelect ||
        (field.type === FieldType.Member && !field.property.isMulti);
    });
    return column?.fieldId;
  }

  static getFieldProperty(column: IViewColumn | undefined, fieldMap: IFieldMap) {
    if (!column) {
      return [];
    }
    const field = fieldMap[column.fieldId];
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
      field.property.unitIds.forEach(id => {
        hiddenGroupMap[id] = false;
      });
    }

    return hiddenGroupMap;
  }

  static defaultStyle(snapshot: ISnapshot, activeViewId: string) {
    const srcView = this.getSrcView(snapshot, activeViewId);
    // 第一个附件字段设置为默认的封面字段

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
    };
  }

  static setViewStyle2Action = (
    snapshot: ISnapshot,
    payload: ISetKanbanStyleValue & { viewId: string },
  ): IJOTAction | null => {
    const { viewId, styleKey, styleValue } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IKanbanViewProperty;
    if (view.type !== ViewType.Kanban || styleValue === view.style[styleKey]) {
      return null;
    }

    if (styleValue == null) {
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
  };

  static getViewIntroduce() {
    return {
      title: t(Strings.kanban_view),
      desc: t(Strings.kanban_guide_desc),
      videoGuide: integrateCdnHost(Settings.kanban_guide_video.value),
    };
  }
}
