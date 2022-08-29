// 这里放常量定义

// Redis 键定义

export enum CacheKeys {
  SOCKET = 'vikadata:nest:socket:%s',
  ROOM_RELATE = 'vikadata:nest:room:%s',
  RESOURCE_RELATE = 'vikadata:nest:resource:%s',
  DATASHEET_FIELD_REF = 'vikadata:nest:fieldRef:%s',
  DATASHEET_FIELD_RE_REF = 'vikadata:nest:fieldReRef:%s',
}

// Redis 存储时间，单位：秒
export const STORAGE_EXPIRE_TIME = parseInt(process.env.STORAGE_EXPIRE_TIME) || 5 * 24 * 3600;
export const REF_STORAGE_EXPIRE_TIME = parseInt(process.env.REF_STORAGE_EXPIRE_TIME) || 90 * 24 * 3600;

// 公用状态码
export enum CommonStatusCode {
  DEFAULT_SUCCESS_CODE = 200,
  DEFAULT_ERROR_CODE = 500,
}

// 公用状态码信息
export enum CommonStatusMsg {
  DEFAULT_SUCCESS_MESSAGE = 'SUCCESS',
  DEFAULT_ERROR_MESSAGE = 'SERVER_ERROR',
}

// Swagger 定义
export class SwaggerConstants {
  public static readonly DESCRIPTION = '格表融合开放 API 文档，帮助你基于强大的维格表数据库快速构建应用';
  public static readonly TITLE = 'Vikadata fusion-api API';
  public static readonly TAG = 'Fusion Open API';
  public static readonly DATASHEET_TAG = 'Datasheet';
  public static readonly AUTH_BEAR_DESCRIPTION = '用户token';
}

// 鉴权令牌的前缀
export const AUTHORIZATION_PREFIX = 'Bearer ';

// tslint:disable-next-line:max-classes-per-file
export class JavaApiPath {
  public static readonly UPLOAD_ATTACHMENT = 'base/attach/upload';
  public static readonly API_USAGES = 'internal/space/{spaceId}/apiUsages';
  public static readonly SPACE_RESOURCE = 'space/resource';
  // 查询空间容量信息
  public static readonly SPACE_CAPACITY = 'space/capacity';
  // 数表op附件引用计算
  public static readonly DST_ATTACH_CITE = 'base/attach/cite';
}

export const NODE_PERMISSION_REFLECTOR_KEY = 'node_permission';

export const FILE_UPLOAD_TMP_PATH = '_upload';

/**
 * request hook 添加的参数
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
 * 自定义缓存头
 */
export const X_MAX_AGE = 'x-max-age';
/**
 * 默认api的最大缓存时间,单位s
 */
export const DEFAULT_X_MAX_AGE = parseInt(process.env.DEFAULT_X_MAX_AGE, 10) || 24 * 60 * 60 ;

/**
 * api缓存前缀
 */
export const API_CACHE_KEY = 'vikadata:cache:fusion:';
/**
 * api最大支持的修改的记录条数
 */
export const API_MAX_MODIFY_RECORD_COUNTS = process.env.API_MAX_MODIFY_RECORD_COUNTS ? parseInt(process.env.API_MAX_MODIFY_RECORD_COUNTS, 10) : 10;
/**
 * pageSize的最大值
 */
export const API_MAX_PAGE_SIZE = 1000;
/**
 * 默认pageSize的大小
 */
export const API_DEFAULT_PAGE_SIZE = 100;
/**
 * 限流的redis的key的前缀
 */
export const NODE_LIMITER_PREFIX = 'vikadata:nest:limiter';

export class NodeExtraConstant {
  /**
   * node extra中的showRecordHistory字段
   */
  public static readonly SHOW_RECORD_HISTORY = 'showRecordHistory';
}

export const SOCKET_GRPC_CLIENT = 'SOCKET_GRPC_CLIENT';

// 100M
export const GRPC_MAX_PACKAGE_SIZE = 1024 * 1024 * 100;

export const VIKA_NEST_CHANNEL = 'vikadata:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV;

/*
 * 应用名称，暂时用于拆分服务
 * 目前服务名称对应关系：
 * ROOM_SERVER：拥有全部功能，fusionAPI + 协同能力
 * FUSION_SERVER：只开放fusionAPI
 */
export const APPLICATION_NAME = process.env.APPLICATION_NAME || 'ROOM_SERVER';

export class EnvConfigKey {
  public static readonly CONST = 'const';
  public static readonly OSS = 'oss';
  public static readonly API_LIMIT = 'api_limit';
  public static readonly ACTUATOR = 'actuator';
}
