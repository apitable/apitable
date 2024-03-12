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

// import * as databusWasmServer from '@apitable/databus-wasm-nodejs';
import { DataBusBridge } from '@apitable/databus-wasm-web';
import { isClient } from '../../../../utils/env';
import { IAxiosResponse } from '../../../../types';
import { IApiWrapper } from '../../store/interfaces/resource';
import { AxiosResponse } from 'axios';
declare let window: {
  __global_handle_response: any;
  location: any;
};

let databus: DataBusBridge;

const _global = global || window;
const envVars = () => {
  if (!_global) {
    return {};
  }
  if (_global['__initialization_data__'] && _global['__initialization_data__']['envVars']) {
    return _global['__initialization_data__']['envVars'];
  }
  return {};
};

const CONST_SKIP_FETCH_INTERCEPTOR = ['print', '__destroy_into_raw', 'constructor', 'free' , 'json0_apply'];

// Get all properties of DataBusBridge that return a Promise
const promiseProperties = Object.getOwnPropertyNames(DataBusBridge?.prototype ?? {})
  .filter((property) => {
    if (CONST_SKIP_FETCH_INTERCEPTOR.includes(property)) {
      return false;
    }
    const propertyDescriptor = Object.getOwnPropertyDescriptor(
      DataBusBridge.prototype,
      property
    );
    return (
      propertyDescriptor?.value?.constructor?.name === 'Function'
    );
  });

const handler = {
// @ts-ignore
  get(target, prop, receiver) {
    if (promiseProperties.includes(prop)) {
      const originalMethod = Reflect.get(target, prop, receiver);
      // @ts-ignore
      return async function (...args) {
        // @ts-ignore
        return await fetchInterceptor(() => originalMethod.apply(this, args));
      };
    }
    return Reflect.get(target, prop, receiver);
  }
};

async function getDatasheetPack<T>(dstId: string) {
  return await databus.get_datasheet_pack(dstId) as AxiosResponse<IApiWrapper & { data: T }>;
}

function isInitialized() {
  return databus != null;
}

async function fetchInterceptor<T>(fetch: () => Promise<any>): Promise<AxiosResponse<IApiWrapper & { data: T }>> {
  let respData: IApiWrapper & { data: T };
  try {
    if (!isInitialized()) {
      await initializeDatabusWasm();
    }
    respData = await fetch();
  } catch (e) {
    console.error(e);
    respData = {} as IAxiosResponse<T>['data'];
    throw new Error('fetch failure for wasm');
  }

  if (isClient() && window.__global_handle_response) {
    return window.__global_handle_response({
      data: respData,
    }, undefined, undefined);
  }
  return {
    data: respData
  } as unknown as AxiosResponse<IApiWrapper & { data: T }>;
}

const initializeDatabusWasm = async () => {
  if (!isClient()) {
    // @ts-ignore
    // databus = databusWasmServer;
    return;
  }
  if (!isInitialized()) {
    const wasmWeb = await import('@apitable/databus-wasm-web').then((module) => module.default);
    await wasmWeb();
    const nestApiUrl = envVars().WASM_NEST_BASE_URL || window.location.origin + '/nest/v1';
    const rustApiUrl = envVars().WASM_RUST_BASE_URL || window.location.origin;
    const dataBusWasmInstance = new DataBusBridge(rustApiUrl, nestApiUrl);
    await dataBusWasmInstance.init();
    databus = new Proxy(dataBusWasmInstance, handler);
  }
};

const getInstance = () => {
  if (!isClient()) {
    // @ts-ignore
    // databus = databusWasmServer;
    return databus;
  }
  if (!isInitialized()) {
    throw new Error('databus not initialized');
  }
  return databus;

};

const getBrowserDatabusApiEnabled = () => {
  if (!_global) {
    return false;
  }

  if (!!envVars().ENABLE_DATABUS_API) {
    return true;
  }

  try {
    // @ts-ignore
    const testFunctionSettings = window.localStorage.getItem('_common_datasheet.TestFunctions');
    const parsedTestFunctionSettings = testFunctionSettings == null ? {} : JSON.parse(testFunctionSettings);
    return parsedTestFunctionSettings['dataBusWasmEnable'] != null;
  } catch (e) {
    if (isClient()) {
      console.error('error getting browser databus api enabled', e);
    }
    return false;
  }
};

export { getInstance, initializeDatabusWasm, getDatasheetPack, getBrowserDatabusApiEnabled };
