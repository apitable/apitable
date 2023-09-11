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

import { expose } from 'comlink';
import dayjs from 'dayjs';
import { applyMiddleware, createStore } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import thunkMiddleware from 'redux-thunk';
import { IReduxState, Reducers } from '@apitable/core';
import { withCompute } from './with_compute';

(() => {
  if (!process.env.SSR) {
    const store = withCompute(
      createStore<IReduxState, any, unknown, unknown>(enableBatching(Reducers.rootReducers), applyMiddleware(thunkMiddleware)),
    );

    (self as any)._store_ = store;

    const initHook = (lang: string) => {
      dayjs.locale(lang);
    };

    expose({
      ...store,
      initHook,
    });
  }
})();
