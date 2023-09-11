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

import { message } from 'antd';
import { Selectors, Strings, t } from '@apitable/core';
import { store } from 'pc/store';

let hide: (() => void) | undefined;
let lastStatus: boolean;
let timer: NodeJS.Timeout | null | undefined;
const key = 'COMPUTED_STATUS_MESSAGE';
store.subscribe(function computedStatusChange() {
  const state = store.getState();
  const computedStatus = Selectors.getComputedStatus(state);
  if (!computedStatus) {
    return;
  }
  const preStatus = lastStatus;
  const hasCalc = Object.values(computedStatus).some((v) => v);
  lastStatus = hasCalc;
  if (timer && !hasCalc) {
    window.clearTimeout(timer);
  }
  if (hasCalc && !preStatus) {
    timer = setTimeout(() => {
      hide = message.loading({ content: t(Strings.data_calculating), duration: 0, key });
      timer = null;
    }, 2000);
  } else if (hide && !hasCalc) {
    hide();
    hide = undefined;
  }
});
