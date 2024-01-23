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
import { IApiWrapper, IWidget, WidgetPackageType, WidgetReleaseType } from '@apitable/core';
import * as Url from './const';

// const baseURL = '/nest/v1';
/**
 * create widget
 * @param name
 * @param spaceId
 * @param packageType
 * @param releaseType
 * @returns
 */
export const createWidget = (
  name: string, spaceId: string, packageType: WidgetPackageType = WidgetPackageType.Custom, releaseType: WidgetReleaseType = WidgetReleaseType.Space
) => {
  return axios.post(Url.CREATE_WIDGET, { name, spaceId, packageType, releaseType });
};

/**
 * Generic interface to support generating a new widget using an existing widget as a template
 *
 */
export const copyWidgetsToNode = (nodeId: string, widgetIds: string[]) => {
  return axios.post(Url.COPY_WIDGET, {
    nodeId,
    widgetIds: widgetIds,
  });
};

export const installWidget = (nodeId: string, packageId: string, name?: string) => {
  return axios.post<IApiWrapper & { data: IWidget }>(Url.INSTALL_WIDGET, {
    nodeId: nodeId,
    widgetPackageId: packageId,
    name
  });
};

