export enum USER_ROOM {
  PREFIX = 'cache:online:room:',
  // 3 days
  EXPIRE = 259200,
}

export enum USER_LANGUAGE {
  PREFIX = 'cache:language:user:',
  // 3 days
  EXPIRE = 259200,
}

export enum CONFIG_CACHE {
  PREFIX = 'cache:config:',
  // 30 days
  EXPIRE = 2592000,
}

export enum SOCKET_CACHE {
  PREFIX = 'cache:socket:',
  // 30 days
  EXPIRE = 2592000,
}

/**
 * Nest Server Cache Key
 *
 * Need to be consistent ('vikadata:' has been used as a global prefix)
 */
export enum NestCacheKeys {
  SOCKET = 'nest:socket:%s',
  RESOURCE_RELATE = 'nest:resource:%s',
}
