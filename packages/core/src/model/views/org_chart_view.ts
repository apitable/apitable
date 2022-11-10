import { Strings, t } from '../../exports/i18n';
import { ViewType } from '../../modules/shared/store/constants';
import { IOrgChartViewProperty, ISnapshot, ISetOrgChartStyle, IViewProperty, IOrgChartViewColumn } from '../../exports/store/interfaces';
import { getViewById, getViewIndex } from '../../exports/store/selectors';
import { DatasheetActions } from '../datasheet';
import { View } from './views';
import { Settings } from 'config';
import { integrateCdnHost } from 'utils';
import { FieldType } from 'types/field_types';
import { IJOTAction, OTActionName } from 'engine/ot/interface';

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
      snapshot.meta.fieldMap[col.fieldId].type === FieldType.Attachment,
    );

    const linkField = srcView.columns.find(col => {
      const field = snapshot.meta.fieldMap[col.fieldId];
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

  static setOrgChartStyle2Action = (
    snapshot: ISnapshot,
    payload: ISetOrgChartStyle,
  ): IJOTAction | null => {
    const { viewId, styleKey, styleValue } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IOrgChartViewProperty;
    if (view.type !== ViewType.OrgChart || styleValue === view.style[styleKey]) {
      return null;
    }
    return {
      n: OTActionName.ObjectReplace,
      p: ['meta', 'views', viewIndex, 'style', styleKey],
      oi: styleValue,
      od: view.style[styleKey],
    };
  };

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
      srcView = views[0];
    }

    return {
      id: DatasheetActions.getNewViewId(views),
      name: DatasheetActions.getDefaultViewName(views, ViewType.OrgChart),
      type: ViewType.OrgChart,
      columns: this.defaultColumns(srcView),
      rows: this.defaultRows(srcView),
      style: this.defaultStyle(snapshot, srcView),
    };
  }

  static getViewIntroduce() {
    return {
      title: t(Strings.org_chart_view),
      desc: t(Strings.org_guide_desc),
      videoGuide: integrateCdnHost(Settings.org_guide_video.value),
    };
  }
}
