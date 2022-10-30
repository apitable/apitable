// core/api is a compatible layer after modularize

import * as Api from '../modules/shared/api';
import * as Url from '../modules/shared/url';
import * as DatasheetApi from '../modules/database/datasheet_api';
import * as IApi from '../modules/shared/api.interface';
import * as FormApi from '../modules/database/form_api';
import * as WidgetApi from '../modules/widget/widget_api';
import * as ApiInterface from '../modules/shared/api.interface';
import * as WidgetApiInterface from '../modules/widget/widget_api.interface';

export * as DashboardApi from '../modules/database/dashboard_api';
export * from '../modules/database/datasheet_api.interface';

export { Url, Api, DatasheetApi, IApi, FormApi, WidgetApi, ApiInterface, WidgetApiInterface };
