export enum USER_ROOM {
  PREFIX = 'cache:online:room:',
  // 3天
  EXPIRE = 259200,
}

export enum USER_LANGUAGE {
  PREFIX = 'cache:language:user:',
  // 3天
  EXPIRE = 259200,
}

export enum CONFIG_CACHE {
  PREFIX = 'cache:config:',
  // 30 天
  EXPIRE = 2592000,
}

export enum SOCKET_CACHE {
  PREFIX = 'cache:socket:',
  // 30 天
  EXPIRE = 2592000,
}

/**
 * Nest Server Cache Key
 * 需保持一致 （'vikadata:' 已作为全局前缀）
 */
export enum NestCacheKeys {
  SOCKET = 'nest:socket:%s',
  RESOURCE_RELATE = 'nest:resource:%s',
}
