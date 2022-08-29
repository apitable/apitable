import axios from 'axios';
import { Url } from 'config';
import Qs from 'qs';
import urlcat from 'urlcat';
import { IApiWrapper, IWidget, WidgetPackageType, WidgetReleaseType } from 'store';
import { IWidgetTemplateItem } from './widget_api.interface';

// const baseURL = '/nest/v1';

export const readInstallationWidgets = (widgetIds: string[], linkId?: string) => {
  return axios.get(Url.INSTALLATION_WIDGETS, {
    params: {
      widgetIds: widgetIds.join(','),
      linkId,
    },
    // 序列化参数 revisions: [1,2,3] 变成正常的GET附带数组参数 revisons=1&revisions=2&revisions=3
    paramsSerializer: params => {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
};

/**
 * 获取组件中心的小组件列表
 */
export const getWidgetCenterList = (type: WidgetReleaseType, filter = true) => {
  return axios.post(Url.WIDGET_CENTER_LIST, { type, filter });
};

export const getWidgetsByNodeId = (nodeId: string) => {
  return axios.get(urlcat(Url.GET_NODE_WIDGETS, { nodeId }));
};

export const installWidget = (nodeId: string, packageId: string, name?: string) => {
  return axios.post<IApiWrapper & { data: IWidget }>(Url.INSTALL_WIDGET, {
    nodeId: nodeId,
    widgetPackageId: packageId,
    name
  });
};

/**
 * @desc 在组件面板中发送到 Dashboard 或者在 Dashboard 中引入小组件
 * @param dashboardId
 * @param widgetId
 */
export const copyWidgetsToDashboard = (dashboardId: string, widgetIds: string[]) => {
  return axios.post(Url.COPY_WIDGET, {
    dashboardId,
    widgetIds: widgetIds,
  });
};

export const getRecentInstalledWidgets = (spaceId: string) => {
  return axios.get(urlcat(Url.RECENT_INSTALL_WIDGET, { spaceId }));
};

export const getWidgetsInfoByNodeId = (nodeId: string) => {
  return axios.get(urlcat(Url.GET_NODE_WIDGETS_PREVIOUS, { nodeId }));
};

// 创建小组件
export const createWidget = (
  name: string, spaceId: string, packageType: WidgetPackageType = WidgetPackageType.Custom, releaseType: WidgetReleaseType = WidgetReleaseType.Space
) => {
  return axios.post(Url.CREATE_WIDGET, { name, spaceId, packageType, releaseType });
};

export const getTemplateList = () => {
  return axios.get<IApiWrapper & { data: IWidgetTemplateItem[] }>(Url.GET_TEMPLATE_LIST);
};

// 下架小组件
export const unpublishWidget = (widgetPackageId: string) => {
  return axios.post(Url.UNPUBLISH_WIDGET, { packageId: widgetPackageId });
};

// 移交小组件
export const transferWidget = (packageId: string, transferMemberId: string) => {
  return axios.post(Url.TRANSFER_OWNER, { packageId, transferMemberId });
};