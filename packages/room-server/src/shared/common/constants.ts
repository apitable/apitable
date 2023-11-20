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
import util from 'util';

// constant definition only

// Redis keys
export enum CacheKeys {
  SOCKET = 'apitable:nest:socket:%s',
  ROOM_RELATE = 'apitable:nest:room:%s',
  RESOURCE_RELATE = 'apitable:nest:resource:%s',
  DATASHEET_FIELD_REF = 'apitable:nest:fieldRef:%s',
  DATASHEET_FIELD_RE_REF = 'apitable:nest:fieldReRef:%s',
  DATASHEET_REVISION_CACHE = 'apitable:nest:datasheetCacheRevision:%s',
  DATASHEET_PACK_CACHE = 'apitable:nest:datasheetCache:%s',
  DATASHEET_CASCADER_TREE = 'apitable:nest:datasheetCascaderCache:%s:%s',
  // first is space id, second is month start date
}

export const SPACE_AUTOMATION_RUN_COUNT_KEY = (spaceId: string): string => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  return util.format('cache:space:automation:count:%s:%s', spaceId, currentYear + '-' + currentMonth);
};

// Redis expire time, units are in seconds
export const STORAGE_EXPIRE_TIME = parseInt(process.env.STORAGE_EXPIRE_TIME!) || 5 * 24 * 3600;
export const REF_STORAGE_EXPIRE_TIME = parseInt(process.env.REF_STORAGE_EXPIRE_TIME!) || 90 * 24 * 3600;
export const DATASHEET_PACK_CACHE_EXPIRE_TIME = parseInt(process.env.DATASHEET_PACK_CACHE_EXPIRE_TIME!) || 1 * 24 * 3600;

// Common status codes
export enum CommonStatusCode {
  DEFAULT_SUCCESS_CODE = 200,
  DEFAULT_ERROR_CODE = 500,
}

// Common status messages
export enum CommonStatusMsg {
  DEFAULT_SUCCESS_MESSAGE = 'SUCCESS',
  DEFAULT_ERROR_MESSAGE = 'SERVER_ERROR',
}

// Swagger constants
export class SwaggerConstants {
  public static readonly DESCRIPTION = 'API Documentation to help you build applications quickly with the powerful APITable service';
  public static readonly TITLE = 'APITable Fusion API';
  public static readonly TAG = 'Fusion Open API';
  public static readonly DATASHEET_TAG = 'Datasheet';
  public static readonly AUTH_BEAR_DESCRIPTION = 'Developer token';
  public static readonly ENTERPRISE_TAG = 'Enterprise';
}

// authorization prefix
export const AUTHORIZATION_PREFIX = 'Bearer ';

// tslint:disable-next-line:max-classes-per-file
export class JavaApiPath {
  public static readonly UPLOAD_ATTACHMENT = 'base/attach/upload';
  public static readonly API_USAGES = 'internal/space/{spaceId}/apiUsages';
  public static readonly SPACE_RESOURCE = 'space/resource';
  // query space capacity information
  public static readonly SPACE_CAPACITY = 'space/capacity';
  // attachments of datasheet reference calculation
  public static readonly DST_ATTACH_CITE = 'base/attach/cite';
}

export const NODE_PERMISSION_REFLECTOR_KEY = 'node_permission';

export const FILE_UPLOAD_TMP_PATH = '_upload';

/**
 * request hook, parameters that will be added to headers
 */
export const USER_HTTP_DECORATE = 'user';
export const DATASHEET_META_HTTP_DECORATE = 'datasheet-meta';
export const DATASHEET_FIELD_MAP_HTTP_DECORATE = 'datasheet-field-map';
export const DATASHEET_HTTP_DECORATE = 'datasheet';
export const SPACE_ID_HTTP_DECORATE = 'space-id';
export const NODE_INFO = 'node-info';
export const REQUEST_AT = 'request-at';
export const SERVER_TIME = 'Server-Timing';
export const REQUEST_ID = 'request-id';
export const DATASHEET_LINKED = 'datasheet-linked';
export const TRACE_ID = 'x-trace-id';
export const DATASHEET_ENRICH_SELECT_FIELD = 'datasheet-enrich-select-field';
export const REQUEST_HOOK_FOLDER = 'request-hook-folder';
export const REQUEST_HOOK_PRE_NODE = 'request-hook-pre-node';
export const DATASHEET_MEMBER_FIELD = 'datasheet-member-field';

/**
 * gRPC MetaData Constant Key
 */
export const CHANGESETS_MESSAGE_ID = 'x-changesets-message-id';
export const CHANGESETS_CMD = 'x-changesets-cmd';

/**
 * custom cache headers
 */
export const X_MAX_AGE = 'x-max-age';

/**
 * default value of the `max-age` property of the API cache, units are seconds
 */
export const DEFAULT_X_MAX_AGE = parseInt(process.env.DEFAULT_X_MAX_AGE!, 10) || 24 * 60 * 60;

/**
 * API Cache prefix
 */
export const API_CACHE_KEY = 'apitable:cache:fusion:';
/**
 * the maximum number of records could be changed in the API
 */
export const API_MAX_MODIFY_RECORD_COUNTS = process.env.API_MAX_MODIFY_RECORD_COUNTS ? parseInt(process.env.API_MAX_MODIFY_RECORD_COUNTS, 10) : 10;
/**
 * maximum page size
 */
export const API_MAX_PAGE_SIZE = 1000;
/**
 * default page size
 */
export const API_DEFAULT_PAGE_SIZE = 100;
/**
 * current-limiting redis key prefix
 */
export const NODE_LIMITER_PREFIX = 'apitable:nest:limiter';

export class NodeExtraConstant {
  /**
   * show record history filed name in the extra of a node
   */
  public static readonly SHOW_RECORD_HISTORY = 'showRecordHistory';
}

export const BACKEND_GRPC_CLIENT = 'BACKEND_GRPC_CLIENT';
export const ROOM_GRPC_CLIENT = 'ROOM_GRPC_CLIENT';
export const SOCKET_GRPC_CLIENT = 'SOCKET_GRPC_CLIENT';

// 100M
export const GRPC_MAX_PACKAGE_SIZE = 1024 * 1024 * 100;

export class EnvConfigKey {
  public static readonly CONST = 'const';
  public static readonly OSS = 'oss';
  public static readonly API_LIMIT = 'api_limit';
  public static readonly ACTUATOR = 'actuator';
}

/**
 * the maximum number of node embedlink
 */
export const NODE_MAX_EMBED_LINK_COUNTS = process.env.NODE_MAX_EMBED_LINK_COUNTS ? parseInt(process.env.NODE_MAX_EMBED_LINK_COUNTS, 10) : 30;

export const SERVER_DOMAIN = process.env.SERVER_DOMAIN ? process.env.SERVER_DOMAIN : '';

export const EMBED_LINK_URL_TEMPLATE = SERVER_DOMAIN + '/embed/%s';
