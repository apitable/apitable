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
export const FETCH_DASHBOARD = '/dashboards/:dashboardId/dataPack';
export const FETCH_SHARE_DASHBOARD = '/shares/:shareId/dashboards/:dashboardId/dataPck';
export const FETCH_TEMPLATE_DASHBOARD = '/templates/:templateId/dashboards/:dashboardId/dataPck';
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
export const GET_FIELD_PERMISSION_PAGE_MEMBER_LIST = '/datasheet/:dstId/field/:fieldId/collaborator/page';
// =============== Column permissions related end =======================

// ================ mirror related start =======================
export const READ_MIRROR_INFO = 'mirrors/:mirrorId/info'; // Request mirror data
export const READ_MIRROR_DATA_PACK = 'mirrors/:mirrorId/dataPack'; // Request the data of the mirror-related table
export const READ_SHARE_MIRROR_INFO = 'shares/:shareId/mirrors/:mirrorId/info'; // Request the data of mirror-related tables
export const READ_SHARE_MIRROR_DATA_PACK = 'shares/:shareId/mirrors/:mirrorId/dataPack'; // Request the data of the mirror-related table
export const GET_MIRROR_SUBSCRIPTIONS = '/mirrors/:mirrorId/records/subscriptions'; // Get the concerned record IDs of the mirror table
export const SUBSCRIBE_MIRROR_RECORDS = '/mirrors/:mirrorNodeId/records/subscriptions'; // Pay attention to the data in the mirror table
export const UNSUBSCRIBE_MIRROR_RECORDS = '/mirrors/:mirrorNodeId/records/subscriptions'; // Unfollow the data in the mirror table
// =============== mirror related end =======================

// ================ View switch related start =======================
export const GET_DST_VIEW_DATA_PACK = 'datasheets/:dstId/views/:viewId/dataPack';
export const GET_SHARE_DST_VIEW_DATA_PACK = 'shares/:shareId/datasheets/:dstId/views/:viewId/dataPack';
// =============== View switch related end =======================

// =============== datasheet related =======================
// ================ form ================
// load form data
export const FORMPACK = '/forms/:formId/meta';
// Get form share page data
export const READ_SHARE_FORMPACK = '/shares/:shareId/forms/:formId/meta';
// Get form template page data
export const READ_TEMPLATE_FORMPACK = '/templates/:templateId/forms/:formId/meta';
// Form submission data in the space station
export const FORM_ADD_RECORD = '/forms/:formId/addRecord';
// form share page submit data
export const SHARE_FORM_ADD_RECORD = '/shares/:shareId/forms/:formId/addRecord';
// Update form related properties in the space station
export const UPDATE_FORM_PROPS = '/forms/:formId/props';
// Get all the properties of the form in the space station
export const READ_FORM_PROPS = '/forms/:formId/props';
// Update form related properties in the space station
export const READ_FORM_SUBMIT_STATUS = '/forms/:formId/submitStatus';
// =============== Magic form related ===============

// =============== Socket =======================
// datasheet long link
export const WEBSOCKET_NAMESPACE = '/room';
// datasheet - collaborative operation long link
export const ROOM_PATH = '/room';
// message notification long link
export const NOTIFICATION_PATH = '/notification';
// =============== Socket related =======================

export const GET_COMMENTS_BY_IDS = 'datasheets/:dstId/records/:recordId/comments';

export const APPLY_RESOURCE_CHANGESETS = 'resources/apply/changesets';

// =============== Resource related =======================
// Get a list of resource-specific changesets
export const READ_CHANGESET = '/resources/:resourceId/changesets';
export const READ_SHARE_CHANGESET = '/shares/:shareId/resources/:resourceId/changesets';
// Get the associated table data of the resource
export const READ_FOREIGN_DATASHEET_PACK = '/resources/:resourceId/foreignDatasheets/:foreignDatasheetId/dataPack';
// Get the associated table data of the shared resource
export const READ_SHARE_FOREIGN_DATASHEET_PACK = '/shares/:shareId/resources/:resourceId/foreignDatasheets/:foreignDatasheetId/dataPack';
// Get comments and history for a single record
export const GET_RECORD_ACTIVITY_LIST = '/resources/:resourceId/records/:recId/activity';
export const READ_EMBED_FOREIGN_DATASHEET_PACK = 'embedlinks/:embedId/resources/:resourceId/foreignDatasheets/:foreignDatasheetId/dataPack';

// =============== datasheet related =======================
// load table data package
export const DATAPACK = '/datasheets/:dstId/dataPack';
// Get the list of specified records in the datasheet
export const READ_RECORDS = '/datasheets/:dstId/records';
// Get the form data of the share page
export const READ_SHARE_DATAPACK = '/shares/:shareId/datasheets/:dstId/dataPack';
// template packet
export const READ_TEMPLATE_DATAPACK = '/templates/datasheets/:dstId/dataPack';
// Get the form  Data of the embed page
export const READ_EMBED_DATAPACK = '/embedlinks/:embedId/resources/:dstId/dataPack';
// get user list
export const GET_USER_LIST = '/datasheets/:nodeId/users';
// Get the Meta corresponding to the datasheet
export const READ_DATASHEET_META = '/datasheets/:dstId/meta';
export const GET_DATASHEET_SUBSCRIPTIONS = '/datasheets/:dstId/records/subscriptions'; // Get the concerned record IDs of the datasheet GET
export const SUBSCRIBE_DATASHEET_RECORDS = '/datasheets/:dstId/records/subscriptions'; // Follow the data in the datasheet POST
export const UNSUBSCRIBE_DATASHEET_RECORDS = '/datasheets/:dstId/records/subscriptions'; // Unfollow the data in the datasheets

// =============== datasheet related =======================

export const GET_CONTENT_DISPOSITION = '/attach/getContentDisposition';

// Cascader data
export const CASCADER_DATA = '/spaces/:spaceId/datasheets/:datasheetId/cascader';

// Get cascader snapshot data
export const CASCADER_SNAPSHOT = '/datasheets/:datasheetId/fields/:fieldId/cascader-snapshot';

// Update cascader snapshot data
export const UPDATE_CASCADER_SNAPSHOT = '/spaces/:spaceId/datasheets/:datasheetId/fields/:fieldId/cascader-snapshot';

// =============== time machine backup ===============

export const DATASHEET_TABLEBUNDLE = 'nodes/:nodeId/tablebundles';

export const UPDATE_DATASHEET_TABLEBUNDLE = '/nodes/:nodeId/tablebundles/:tablebundleId';

export const RECOVER_DATASHEET_TABLEBUNDLE = '/nodes/:nodeId/tablebundles/:tablebundleId/recover';

export const PREVIEW_DATASHEET_TABLEBUNDLE = '/nodes/:nodeId/tablebundles/:tablebundleId/preview';

// =============== time machine backup end ==================

// =============== archived records  ===============
export const GET_ARCHIVED_RECORDS = '/datasheets/:dstId/records/archived';
