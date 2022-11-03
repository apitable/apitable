import axios from 'axios';
import * as Url from './url.data';
import urlcat from 'urlcat';

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
