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
import { Settings } from 'config';
import { integrateCdnHost } from 'utils';

export class FormView extends View {
  static getViewIntroduce() {
    return {
      title: t(Strings.form_view),
      desc: t(Strings.form_view_desc),
      videoGuide: integrateCdnHost(Settings.view_form_guide_video.value),
    };
  }
  static generateDefaultProperty() {
    return null;
  }
}
