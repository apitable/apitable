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

export * from '../../user/api/url.auth';
export * from '../../user/api/url.user';
export * from '../../space/api/url.space';
export * from '../../space/api/url.node';
export * from '../../enterprise';
export * from '../../org/api/url.org';
export * from '../../space/api/url.template';
export * from '../../widget/api/url.widget';
export * from '../../database/api/url.data';
export * from '../../space/api/url.notification';
export * from '../../space/api/url.appstore';

/**
 * Main API URL Address
 */
export const BASE_URL = '/api/v1';

/**
 * Nest Base Url
 */

export const NEST_BASE_URL = '/nest/v1';

/**
 * Upload attachments
 */
export const UPLOAD_ATTACH = '/base/attach/upload';

/**
 * The url to get attachment preview
 */
export const OFFICE_PREVIEW = '/base/attach/officePreview/:spaceId';

// Space Station - Get a list of third-party apps SINGLE_APP_INSTANCE
export const GET_MARKETPLACE_APPS = '/marketplace/integration/space/:spaceId/apps';

// space station - start the application
export const APP_ENABLE = '/marketplace/integration/space/:spaceId/app/:appId/open';
// space station - close the app
export const APP_DISABLE = 'marketplace/integration/space/:spaceId/app/:appId/stop';

// =============== V code =======================
export const CODE_EXCHANGE = '/vcode/exchange/';

// =============== player related =======================

// ================ Risk control related =======================
// Content risk control
export const CREATE_REPORTS = '/censor/createReports';
// ================ Risk control related =======================

// Get the experimental features that are enabled
export const GET_LABS_FEATURE = 'user/labs/features';
// Get a list of experimental features
export const GET_LABS_FEATURE_LIST = 'labs/features';

// Get URL related information, used for URL column identification
export const GET_URL_META = '/internal/field/url/awareContent';
export const GET_URL_META_BATCH = '/internal/field/url/awareContents';

// Attachment direct upload
export const UPLOAD_PRESIGNED_URL = '/asset/upload/preSignedUrl';
export const UPLOAD_CALLBACK = 'asset/upload/callback';

// ============ Character related end =====================//

// Get EmbedLink Info
export const EMBED_LINK_INFO = 'embedlinks';
export const LOAD_OR_SEARCH_EMBED = 'embedlinks/:embedId/org/loadOrSearch';