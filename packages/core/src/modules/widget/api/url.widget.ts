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

// ================ Widget related =======================
export const INSTALLATION_WIDGETS = '/widget/get';
export const WIDGET_CENTER_LIST = '/widget/package/store/list';
export const INSTALL_WIDGET = '/widget/create';
export const COPY_WIDGET = '/widget/copy';
export const RECENT_INSTALL_WIDGET = '/space/:spaceId/widget';
export const GET_NODE_WIDGETS = '/node/:nodeId/widgetPack';
export const CREATE_WIDGET = '/widget/package/create';
// Get the widget information installed by the node, which is only provided for preview, does not contain complete data
export const GET_NODE_WIDGETS_PREVIOUS = '/node/:nodeId/widget';
// Get a list of widget templates
export const GET_TEMPLATE_LIST = '/widget/template/package/list';
// remove widget
export const UNPUBLISH_WIDGET = '/widget/package/unpublish';
// hand over widget
export const TRANSFER_OWNER = '/widget/package/transfer/owner';

// ================ Widget related =======================
