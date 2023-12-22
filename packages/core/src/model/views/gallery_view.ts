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
import { LayoutType, ViewType } from 'modules/shared/store/constants';
import { getViewById } from 'modules/database/store/selectors/resource/datasheet/base';
import { FieldType } from 'types';
import { IGalleryViewProperty, ISnapshot, IViewProperty } from '../../exports/store/interfaces';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { CardView } from './card_view';
import { Settings } from 'config';
import { integrateCdnHost } from 'utils';

export class GalleryView extends CardView {

  static defaultStyle(snapshot: ISnapshot, srcView: IViewProperty) {

    // the first attachment field set as default cover field
    const initCoverField = srcView.columns.find(col =>
      snapshot.meta.fieldMap[col.fieldId]!.type === FieldType.Attachment,
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
      srcView = views[0]!;
    }

    return {
      id: DatasheetActions.getNewViewId(views),
      name: DatasheetActions.getDefaultViewName(views, ViewType.Gallery),
      type: ViewType.Gallery,
      columns: this.defaultColumns(srcView, 4),
      rows: this.defaultRows(srcView),
      style: this.defaultStyle(snapshot, srcView),
      displayHiddenColumnWithinMirror: true
    };
  }

  static getViewIntroduce() {
    return {
      title: t(Strings.gallery_view),
      desc: t(Strings.gallery_guide_desc),
      videoGuide: integrateCdnHost(Settings.view_gallery_guide_video.value),
    };
  }
}
