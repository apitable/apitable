import { ITableBundleLoader, ITableBundleSaver } from '@apitable/core';
import fs from 'fs';

export class TableBundleLoader implements ITableBundleLoader {
  load(path: string): Buffer {
    return fs.readFileSync(path);
  }
}
export class TableBundleSaver implements ITableBundleSaver {
  save(array: Uint8Array, path: string): void {
    return fs.writeFileSync(path, array);
  }

}