import { EXPAND_RECORD } from 'pc/components/expand_record';

class ExpandRecordManager {
  focusHolderRefs: React.RefObject<HTMLInputElement>[];

  constructor() {
    this.focusHolderRefs = [];
  }

  pushFocusHolderRef(ref: React.RefObject<HTMLInputElement>) {
    if (!this.checkData()) { return; }
    this.focusHolderRefs.push(ref);
  }

  destroyCurrentRef() {
    if (!this.checkData()) { return; }
    return this.focusHolderRefs.pop();
  }

  getPreviousFocusHolderRef() {
    if (!this.focusHolderRefs.length) { return; }
    return this.focusHolderRefs[this.focusHolderRefs.length - 1];
  }

  destroy() {
    this.focusHolderRefs = [];
  }

  /**
   * @description 检查缓存的数据和 dom 节点的数据是否保持一致，不一致则重置缓存
   * @returns
   */
  checkData() {
    const container = document.querySelectorAll(`.${EXPAND_RECORD}`);
    if (container.length !== this.focusHolderRefs.length) {
      console.warn('! ' + '缓存和实际数据有差距');
      this.destroy();
      return false;
    }
    return true;
  }
}

export const expandRecordManager = new ExpandRecordManager();