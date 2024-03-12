/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { EXPAND_RECORD } from 'pc/components/expand_record/expand_record.enum';

class ExpandRecordManager {
  focusHolderRefs: React.RefObject<HTMLInputElement>[];

  constructor() {
    this.focusHolderRefs = [];
  }

  pushFocusHolderRef(ref: React.RefObject<HTMLInputElement>) {
    if (!this.checkData()) {
      return;
    }
    this.focusHolderRefs.push(ref);
  }

  destroyCurrentRef() {
    if (!this.checkData()) {
      return;
    }
    return this.focusHolderRefs.pop();
  }

  getPreviousFocusHolderRef() {
    if (!this.focusHolderRefs.length) {
      return;
    }
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
