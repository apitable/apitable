import { IJOTAction, OTActionName } from 'engine';
import { Strings, t } from 'i18n';
import { LayoutType, ViewType } from 'store';
import { getViewById, getViewIndex } from 'store/selector';
import { FieldType } from 'types';
import { IGalleryViewProperty, ISetGalleryStyle, ISnapshot, IViewProperty } from '../../store/interface';
import { DatasheetActions } from '../datasheet';
import { CardView } from './card_view';
import { Settings } from 'config';
import { integrateCdnHost } from 'utils';

export class GalleryView extends CardView {

  static defaultStyle(snapshot: ISnapshot, srcView: IViewProperty) {

    // the first attachment field set as default cover field
    const initCoverField = srcView.columns.find(col =>
      snapshot.meta.fieldMap[col.fieldId].type === FieldType.Attachment,
    );

    return {
      layoutType: LayoutType.Flex,
      isAutoLayout: false, //default is manual layout, show 4
      cardCount: 4,
      isCoverFit: true,
      coverFieldId: initCoverField ? initCoverField.fieldId : undefined,
      isColNameVisible: true,
    };
  }

  static override defaultRows(srcView: IViewProperty) {
    if (srcView) {
      return srcView.rows;
    }
    return [];
  }

  static generateDefaultProperty(snapshot: ISnapshot, activeViewId: string | null | undefined): IGalleryViewProperty {
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
      name: DatasheetActions.getDefaultViewName(views, ViewType.Gallery),
      type: ViewType.Gallery,
      columns: this.defaultColumns(srcView, 4),
      rows: this.defaultRows(srcView),
      style: this.defaultStyle(snapshot, srcView),
    };
  }

  /**
   * gallery view UI setting
   */
  static setGalleryStyle2Action = (
    snapshot: ISnapshot,
    payload: ISetGalleryStyle,
  ): IJOTAction | null => {
    const { viewId, styleKey, styleValue } = payload;

    const viewIndex = getViewIndex(snapshot, viewId);
    if (viewIndex < 0) {
      return null;
    }

    const view = snapshot.meta.views[viewIndex] as IGalleryViewProperty;
    if (view.type !== ViewType.Gallery || styleValue === view.style[styleKey]) {
      return null;
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
      title: t(Strings.gallery_view),
      desc: t(Strings.gallery_guide_desc),
      videoGuide: integrateCdnHost(Settings.gallery_guide_video.value),
    };
  }
}
