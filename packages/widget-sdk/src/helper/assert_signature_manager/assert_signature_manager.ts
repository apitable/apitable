import { debounce } from 'lodash';
import { batchSignature } from './api';
import { splitAssertPath } from './utils';

const EXPIRE_TIME = 1000 * 60 * 60 * 1.9; //2小时

type ITimestamp = number;

type CallBack = () => void;

const DEBOUNCE_TIME = 500;

declare global {
  interface Window {
    __initialization_data__: any;
  }
}

export class AssertSignatureManager {
  private assertSignatureMap: Map<string, { url: string; expireDate: ITimestamp }> = new Map();
  private fetchQueue: Set<string> = new Set();
  private subscribeSignatureSet: Set<CallBack> = new Set();

  private _batchUpdateAssertSignatureMap;

  constructor() {
    this._batchUpdateAssertSignatureMap = debounce(async(strings) => {
      this.fetchQueue.clear();
      const subscribeSignatureSet = [...this.subscribeSignatureSet];
      this.subscribeSignatureSet.clear();

      try {
        const data = await batchSignature(strings);

        data.map((item) => {
          this.assertSignatureMap.set(item.resourceKey, { url: item.url, expireDate: Date.now() + EXPIRE_TIME });
        });

        subscribeSignatureSet.forEach((cb) => cb());
      } catch (e: any) {
        console.error(e.message);
      }
    }, DEBOUNCE_TIME);
  }

  public getAssertSignatureUrl(url: string) {
    if (!window.__initialization_data__?.envVars?.OSS_SIGNATURE_ENABLED) {
      return url;
    }

    if (!url) {
      return url;
    }

    const token = splitAssertPath(url);

    const assert = this.assertSignatureMap.get(token);

    if (!assert) {
      this.batchUpdateAssertSignatureMap(token);
      return;
    }

    if (!this.validateAssertSignature(token)) {
      this.batchUpdateAssertSignatureMap(token);
      return;
    }

    return assert.url;
  }

  private validateAssertSignature(url: string) {
    const assert = this.assertSignatureMap.get(url);

    if (!assert) {
      return false;
    }

    // 判断当前的时间是否在验证时间内，如果不在，则重新获取
    if (Date.now() >= assert.expireDate) {
      return false;
    }
    return true;
  }

  private batchUpdateAssertSignatureMap(url: string) {
    this.fetchQueue.add(url);
    this._batchUpdateAssertSignatureMap(Array.from(this.fetchQueue));
  }

  subscribe(cb: CallBack) {
    this.subscribeSignatureSet.add(cb);
  }
}

export const assertSignatureManager = new AssertSignatureManager();
