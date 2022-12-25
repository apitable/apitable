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

import { store } from 'pc/store';

store.subscribe(function spaceIdChange() {
  const state = store.getState();
  const spaceDomain = state.user.info?.spaceDomain;
  // A little local debugging compatibility
  if (process.env.NODE_ENV === 'production' && spaceDomain && spaceDomain !== window.location.host) {
    window.location.host = spaceDomain;
  }
});
