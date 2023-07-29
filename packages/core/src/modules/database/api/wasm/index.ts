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

import databusWasm from '@apitable/databus-wasm';
import { DataBusBridge } from '@apitable/databus-wasm';
import { isClient } from '../../../../utils/env';
import { IAxiosResponse } from '../../../../types';
import { IApiWrapper, IServerDatasheetPack } from '../../store/interfaces/resource';
import { AxiosResponse } from 'axios';

declare let window: {
  __global_handle_response: any
  location: any;
};

async function getDatasheetPack(dstId: string) {
  return await fetchInterceptor<IServerDatasheetPack>(() => databus.get_datasheet_pack(dstId));
}

async function fetchInterceptor<T>(fetch: () => Promise<any>): Promise<AxiosResponse<IApiWrapper & { data: T }>> {
  let respData: IApiWrapper & { data: T };
  try {
    if (!databus) {
      await initializeDatabusWasm();
    }
    respData = await fetch();
  } catch (e) {
    console.error(e);
    respData = {} as IAxiosResponse<T>['data'];
    throw new Error('fetch failure for wasm');
  }

  if (isClient()) {
    return window.__global_handle_response({
      data: respData,
    }, undefined, undefined);
  }
  return {
    data: respData
  } as unknown as AxiosResponse<IApiWrapper & { data: T }>;
}

let databus: DataBusBridge;

const initializeDatabusWasm = async() => {
  if (!isClient()) {
    return;
  }
  if (!databus) {
    await databusWasm().then(() => {
      databus = new DataBusBridge(window.location.origin);
    });
  }
};

export { getDatasheetPack, initializeDatabusWasm };