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
   * @description Check that the data in the cache is consistent with the data in the dom node, and reset the cache if it is not
   * @returns
   */
  checkData() {
    const container = document.querySelectorAll(`.${EXPAND_RECORD}`);
    if (container.length !== this.focusHolderRefs.length) {
      console.warn('! ' + 'Gap between cache and actual data');
      this.destroy();
      return false;
    }
    return true;
  }
}

export const expandRecordManager = new ExpandRecordManager();