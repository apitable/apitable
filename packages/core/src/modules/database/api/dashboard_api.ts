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

import axios from 'axios';
import urlcat from 'urlcat';
import * as Url from './url.data';

const baseURL = process.env.NEXT_PUBLIC_NEXT_API;

export const fetchDashboardPack = (dashboardId: string) => {
  return axios.get(urlcat(Url.FETCH_DASHBOARD, { dashboardId }), {
    baseURL,
  });
};

export const fetchShareDashboardPack = (dashboardId: string, shareId: string,) => {
  return axios.get(urlcat(Url.FETCH_SHARE_DASHBOARD, { shareId, dashboardId }), {
    baseURL,
  });
};

export const fetchTemplateDashboardPack = (dashboardId: string, templateId: string) => {
  return axios.get(urlcat(Url.FETCH_TEMPLATE_DASHBOARD, { dashboardId, templateId }), {
    baseURL,
  });
};

export const fetchEmbedDashboardPack = (dashboardId: string, embedId: string) => {
  return axios.get(urlcat(Url.FETCH_EMBED_DASHBOARD, { dashboardId, embedId }), {
    baseURL,
  });
};
