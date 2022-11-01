import { IJOTAction, OTActionName } from 'engine';
import { Strings, t } from 'i18n';
import { Field } from 'model/field';
import { 
  GanttColorType, IFieldMap, IGanttViewColumn, IGanttViewProperty, ISetGanttStyle, ISnapshot, IViewProperty, ViewType 
} from 'store';
import { getViewIndex } from 'store/selector';
import { BasicValueType } from 'types';
import { DatasheetActions } from '../datasheet';
import { View } from './views';
import { integrateCdnHost } from 'utils';
import { Settings } from 'config';

export const DEFAULT_WORK_DAYS = [1, 2, 3, 4, 5];

export class GanttView extends View {
  override get recordShowName(){
    return t(Strings.gantt_task);
  }

  override get recordShowUnit(){
    return '';
  }

  static getViewIntroduce() {
    return {
      title: t(Strings.gantt_view),
      desc: t(Strings.gantt_guide_desc),
      videoGuide: integrateCdnHost(Settings.gantt_guide_video.value),
    };
  }

  static findDateTimeFieldIds(srcView: IViewProperty, fieldMap: IFieldMap) {
    const filterIds = srcView.columns.filter(({ fieldId }) => {
      const field = fieldMap[fieldId];
      return Field.bindModel(field).basicValueType === BasicValueType.DateTime;
    }).map(column => column.fieldId);
    return filterIds;
  }

  static defaultStyle(snapshot: ISnapshot, activeViewId: string | null | undefined) {
    const srcView = this.getSrcView(snapshot, activeViewId);
    const dateTimeFieldIds = this.findDateTimeFieldIds(srcView, snapshot.meta.fieldMap);

    return {
      startFieldId: dateTimeFieldIds[0],
      endFieldId: dateTimeFieldIds[1] || dateTimeFieldIds[0],
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

  static generateDefaultProperty(snapshot: ISnapshot, activeViewId: string | null | undefined): IGanttViewProperty {
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
      style: this.defaultStyle(snapshot, activeViewId),
    };
  }

  static setGanttStyle2Action = (snapshot: ISnapshot, payload: { viewId: string, data: ISetGanttStyle[] }): IJOTAction[] => {
    const { viewId, data } = payload;
    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) return [];
    const view = snapshot.meta.views[viewIndex] as IGanttViewProperty;
    if (view.type !== ViewType.Gantt) return [];

    return data.filter(({ styleKey, styleValue }) => {
      return styleValue !== view.style[styleKey];
    }).map(({ styleKey, styleValue }) => {
      return {
        n: OTActionName.ObjectReplace,
        p: ['meta', 'views', viewIndex, 'style', styleKey],
        oi: styleValue,
        od: view.style[styleKey],
      };
    });
  };
}