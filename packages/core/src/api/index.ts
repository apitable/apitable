// core/api is a compatible layer after modularize

import * as Api from '../modules/shared/api/api';
import * as Url from '../modules/shared/api/url';
import * as DatasheetApi from '../modules/database/api/datasheet_api';
import * as IApi from '../modules/shared/api/api.interface';
import * as FormApi from '../modules/database/api/form_api';
import * as WidgetApi from '../modules/widget/api/widget_api';
import * as ApiInterface from '../modules/shared/api/api.interface';
import * as WidgetApiInterface from '../modules/widget/api/widget_api.interface';

export * as DashboardApi from '../modules/database/api/dashboard_api';
export * from '../modules/database/api/datasheet_api.interface';

export { Url, Api, DatasheetApi, IApi, FormApi, WidgetApi, ApiInterface, WidgetApiInterface };
