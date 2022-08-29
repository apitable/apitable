import { EventEmitter } from 'events';

/**
 * 配置存储器
 * 在内存里
 */
export class ConfigStoreInMemory extends EventEmitter {
  private static _config: Map<string, any> = new Map();

  get config() {
    return ConfigStoreInMemory._config;
  }

  set(key: string, value: any) {
    this.config.set(key, value);
  }

  get<T>(key: string, defaultValue?: T | any) {
    return this.config.get(key) || defaultValue;
  }

  clear() {
    this.config.clear();
  }
}
