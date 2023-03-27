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

// =============== Dashboard related =======================
export const FETCH_DASHBOARD = '/dashboard/:dashboardId/dataPack';
export const FETCH_SHARE_DASHBOARD = '/share/:shareId/dashboard/:dashboardId/dataPck';
export const FETCH_TEMPLATE_DASHBOARD = '/template/:templateId/dashboard/:dashboardId/dataPck';
export const FETCH_EMBED_DASHBOARD = '/embedlinks/:embedId/dashboards/:dashboardId/dataPack';
// =============== Dashboard related =======================

// =============== Column permissions related start =======================
export const FIELD_PERMISSION_ADD_ROLE = 'datasheet/:dstId/field/:fieldId/addRole';
export const FIELD_PERMISSION_DELETE_ROLE = 'datasheet/:dstId/field/:fieldId/deleteRole';
export const FIELD_PERMISSION_EDIT_ROLE = 'datasheet/:dstId/field/:fieldId/editRole';
export const FIELD_PERMISSION_ROLE_LIST = 'datasheet/:dstId/field/:fieldId/listRole';
export const FIELD_PERMISSION_STATUS = 'datasheet/:dstId/field/:fieldId/permission/:status';
export const FIELD_PERMISSION_UPDATE_SETTING = 'datasheet/:dstId/field/:fieldId/updateRoleSetting';
export const GET_FIELD_PERMISSION_MAP = 'datasheet/field/permission';
export const BATCH_EDIT_PERMISSION_ROLE = 'datasheet/:dstId/field/:fieldId/batchEditRole';
export const BATCH_DELETE_PERMISSION_ROLE = 'datasheet/:dstId/field/:fieldId/batchDeleteRole';
// =============== Column permissions related end =======================

// ================ mirror related start =======================
export const READ_MIRROR_INFO = 'mirror/:mirrorId/info'; // Request mirror data
export const READ_MIRROR_DATA_PACK = 'mirror/:mirrorId/dataPack'; // Request the data of the mirror-related table
export const READ_SHARE_MIRROR_INFO = 'share/:shareId/mirror/:mirrorId/info'; // Request the data of mirror-related tables
export const READ_SHARE_MIRROR_DATA_PACK = 'share/:shareId/mirror/:mirrorId/dataPack'; // Request the data of the mirror-related table
export const GET_MIRROR_SUBSCRIPTIONS = '/mirrors/:mirrorId/records/subscriptions'; // Get the concerned record IDs of the mirror table
export const SUBSCRIBE_MIRROR_RECORDS = '/mirrors/:mirrorNodeId/records/subscriptions'; // Pay attention to the data in the mirror table
export const UNSUBSCRIBE_MIRROR_RECORDS = '/mirrors/:mirrorNodeId/records/subscriptions'; // Unfollow the data in the mirror table
// =============== mirror related end =======================

// ================ View switch related start =======================
export const GET_DST_VIEW_DATA_PACK = 'datasheet/:dstId/view/:viewId/dataPack';
export const GET_SHARE_DST_VIEW_DATA_PACK = 'share/:shareId/datasheet/:dstId/view/:viewId/dataPack';
// =============== View switch related end =======================

// =============== datasheet related =======================
// ================ form ================
// load form data
export const FORMPACK = '/form/:formId/dataPack';
// Get form share page data
export const READ_SHARE_FORMPACK = '/share/:shareId/form/:formId/dataPack';
// Get form template page data
export const READ_TEMPLATE_FORMPACK = '/template/:templateId/form/:formId/dataPack';
// Form submission data in the space station
export const FORM_ADD_RECORD = '/form/:formId/addRecord';
// form share page submit data
export const SHARE_FORM_ADD_RECORD = '/share/:shareId/form/:formId/addRecord';
// Update form related properties in the space station
export const UPDATE_FORM_PROPS = '/form/:formId/props';
// Get all the properties of the form in the space station
export const READ_FORM_PROPS = '/form/:formId/props';
// Update form related properties in the space station
export const READ_FORM_SUBMIT_STATUS = '/form/:formId/submitStatus';
// =============== Magic form related ===============

// =============== Socket =======================
// datasheet long link
export const WEBSOCKET_NAMESPACE = '/room';
// datasheet - collaborative operation long link
export const ROOM_PATH = '/room';
// message notification long link
export const NOTIFICATION_PATH = '/notification';
// =============== Socket related =======================

export const GET_COMMENTS_BY_IDS = 'datasheet/:dstId/record/:recordId/comments';

export const APPLY_RESOURCE_CHANGESETS = 'resource/apply/changesets';

// =============== Resource related =======================
// Get a list of resource-specific changesets
export const READ_CHANGESET = '/resource/:resourceId/changesets';
export const READ_SHARE_CHANGESET = '/shares/:shareId/resources/:resourceId/changesets';
// Get the associated table data of the resource
export const READ_FOREIGN_DATASHEET_PACK = '/resource/:resourceId/foreignDatasheet/:foreignDatasheetId/dataPack';
// Get the associated table data of the shared resource
export const READ_SHARE_FOREIGN_DATASHEET_PACK = '/share/:shareId/resource/:resourceId/foreignDatasheet/:foreignDatasheetId/dataPack';
// Get comments and history for a single record
export const GET_RECORD_ACTIVITY_LIST = '/resources/:resourceId/records/:recId/activity';
export const READ_EMBED_FOREIGN_DATASHEET_PACK = 'embedlinks/:embedId/resources/:resourceId/foreignDatasheets/:foreignDatasheetId/dataPack';

// =============== datasheet related =======================
// load table data package
export const DATAPACK = '/datasheet/:dstId/dataPack';
// Get the list of specified records in the datasheet
export const READ_RECORDS = '/datasheet/:dstId/records';
// Get the form data of the share page
export const READ_SHARE_DATAPACK = '/share/:shareId/datasheet/:dstId/dataPack';
// template packet
export const READ_TEMPLATE_DATAPACK = '/template/datasheet/:dstId/dataPack';
// Get the form  Data of the embed page
export const READ_EMBED_DATAPACK = '/embedlinks/:embedId/datasheets/:dstId/dataPack';
// get user list
export const GET_USER_LIST = '/datasheet/:nodeId/users';
// Get the Meta corresponding to the datasheet
export const READ_DATASHEET_META = '/datasheet/:dstId/meta';
export const GET_DATASHEET_SUBSCRIPTIONS = '/datasheets/:dstId/records/subscriptions'; // Get the concerned record IDs of the datasheet GET
export const SUBSCRIBE_DATASHEET_RECORDS = '/datasheets/:dstId/records/subscriptions'; // Follow the data in the datasheet POST
export const UNSUBSCRIBE_DATASHEET_RECORDS = '/datasheets/:dstId/records/subscriptions'; // Unfollow the data in the datasheets

// =============== datasheet related =======================

export const GET_CONTENT_DISPOSITION = '/attach/getContentDisposition';
