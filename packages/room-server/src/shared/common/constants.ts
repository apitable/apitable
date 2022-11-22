// constant definition only

// Redis keys
export enum CacheKeys {
  SOCKET = 'vikadata:nest:socket:%s',
  ROOM_RELATE = 'vikadata:nest:room:%s',
  RESOURCE_RELATE = 'vikadata:nest:resource:%s',
  DATASHEET_FIELD_REF = 'vikadata:nest:fieldRef:%s',
  DATASHEET_FIELD_RE_REF = 'vikadata:nest:fieldReRef:%s',
}

// Redis expire time, units are in seconds
export const STORAGE_EXPIRE_TIME = parseInt(process.env.STORAGE_EXPIRE_TIME) || 5 * 24 * 3600;
export const REF_STORAGE_EXPIRE_TIME = parseInt(process.env.REF_STORAGE_EXPIRE_TIME) || 90 * 24 * 3600;

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
  public static readonly DESCRIPTION = 'API Documentation to help you build applications quickly with the powerful Vikadata service';
  public static readonly TITLE = 'Vikadata fusion-api API';
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
 * custom cache headers
 */
export const X_MAX_AGE = 'x-max-age';
/**
 * default value of the `max-age` property of the API cache, units are seconds
 */
export const DEFAULT_X_MAX_AGE = parseInt(process.env.DEFAULT_X_MAX_AGE, 10) || 24 * 60 * 60;

/**
 * API Cache prefix
 */
export const API_CACHE_KEY = 'vikadata:cache:fusion:';
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
export const NODE_LIMITER_PREFIX = 'vikadata:nest:limiter';

export class NodeExtraConstant {
  /**
   * show record history filed name in the extra of a node
   */
  public static readonly SHOW_RECORD_HISTORY = 'showRecordHistory';
}

export const SOCKET_GRPC_CLIENT = 'SOCKET_GRPC_CLIENT';

// 100M
export const GRPC_MAX_PACKAGE_SIZE = 1024 * 1024 * 100;

export const VIKA_NEST_CHANNEL = 'vikadata:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV;

/*
 * application type, could be one of the following
 */
export type ApplicationType =
  /** full functionality（default） */
  | 'ROOM_SERVER'
  /** fusion API only */
  | 'FUSION_SERVER'
  /** rest API only */
  | 'NEST_REST_SERVER';

export const APPLICATION_NAME: ApplicationType = (process.env.APPLICATION_NAME || 'ROOM_SERVER') as ApplicationType;

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
