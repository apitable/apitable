import * as crypto from 'crypto';
import { join } from 'path';
import { LiteralObject } from '@nestjs/common';
import { extend } from 'lodash';

export abstract class BaseOssStore {
  protected abstract handleResponse(cb: any): any;

  protected options: any;

  protected constructor(args: LiteralObject) {
    this.options = extend({
      region: '',
      path: process.env.NODE_ENV,
      bucket: '',
      // 是否解析喂json
      parse: true,
      // 文件后缀
      fileSuffix: '.json'
    }, args);
  }

  protected getFileNameByKey(key: string): string {
    const keys = key.split(':');
    let filePath = this.options.path;
    for (let i = 0; i < keys.length - 1; i++) {
      filePath = join(filePath, keys[i]);
    }
    const hash = crypto.createHash('md5').update(key + '').digest('hex');
    return join(filePath, hash + this.options.fileSuffix);
  }

}
