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
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as Api from '../../modules/shared/api/api';
import * as Url from '../../modules/shared/api/url';
import * as DatasheetApi from '../../modules/database/api/datasheet_api';
import * as IApi from '../../modules/shared/api/api.interface';
import * as FormApi from '../../modules/database/api/form_api';
import * as WidgetApi from '../../modules/widget/api/widget_api';
import * as ApiInterface from '../../modules/shared/api/api.interface';
import * as WidgetApiInterface from '../../modules/widget/api/widget_api.interface';

export * as DashboardApi from '../../modules/database/api/dashboard_api';
export * from '../../modules/database/api/datasheet_api.interface';

export { Url, Api, DatasheetApi, IApi, FormApi, WidgetApi, ApiInterface, WidgetApiInterface };

export interface IServerResponse<T = any> {
  success: boolean;
  message: string;
  code: number;
  data: T;
}

const baseURL = Url.BASE_URL;
// const nestURL = Url.NEST_BASE_URL;

class ServerResponseError extends Error {
  public code!: number;
  constructor(data: AxiosResponse<IServerResponse>) {
    typeof data.data === 'object' ? super(data.data.message) : super(data.data);

    this.name = 'ServerResponseError';
    if (typeof data.data === 'object') {
      this.code = data.data.code;
      console.error(`request: ${data.config.url}\nmessage: ${data.data.message}`, data.data);
    } else {
      this.code = data.status;
      console.error(`request: ${data.config.url}\nmessage: ${data.data}`);
    }
  }
}

const onResponseError = (error: AxiosError<IServerResponse>) => {
  if (error.response) {
    if (error.isAxiosError) {
      const { response } = error;
      if (response) {
        const { data } = response;
        const { message } = data;
        if (message) {
          error.message = message;
        }
      }
    }
    throw new ServerResponseError(error.response!);
  } else {
    // offline or timeout ?
    throw error;
  }
};

const onResponse = (response: AxiosResponse<IServerResponse>) => {
  if (response.data.success === false) {
    throw new ServerResponseError(response);
  } else {
    return response.data;
  }

};
const createAxios = (config: AxiosRequestConfig) => {
  const http = axios.create(Object.assign({
    timeout: 60 * 1000,
    withCredentials: true,
  }, config));
  http.interceptors.response.use(onResponse, onResponseError);
  return http;
};

export const http = createAxios({
  baseURL,
});