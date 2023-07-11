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

// core/api is a compatible layer after modularize

import * as Api from '../../modules/shared/api/api';
import * as Url from '../../modules/shared/api/url';
import * as DatasheetApi from '../../modules/database/api/datasheet_api';
import * as IApi from '../../modules/shared/api/api.interface';
import * as FormApi from '../../modules/database/api/form_api';
import * as WidgetApi from '../../modules/widget/api/widget_api';
import * as ApiInterface from '../../modules/shared/api/api.interface';
import * as WidgetApiInterface from '../../modules/widget/api/widget_api.interface';

export * as ApiEnum from 'modules/shared/api/enum';

export * as DashboardApi from '../../modules/database/api/dashboard_api';
export * from '../../modules/database/api/datasheet_api.interface';

export { Url, Api, DatasheetApi, IApi, FormApi, WidgetApi, ApiInterface, WidgetApiInterface };
