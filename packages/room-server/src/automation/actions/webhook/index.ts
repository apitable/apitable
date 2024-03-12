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

import fetch from 'node-fetch';
import FormData from 'form-data';
import https from 'https';
import { ResponseStatusCodeEnums } from '../enum/response.status.code.enums';
import { IActionResponse, IErrorResponse, ISuccessResponse } from '../interface/action.response';

interface IHeader {
  key: string;
  value: string;
}

interface IWebhookRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers: IHeader[];
  url: string;
  body?:
    | {
        type: 'form-data';
        formData: {
          key: string;
          value: any;
        }[];
      }
    | {
        format: 'json' | 'text';
        type: 'json' | 'raw'; // TODO: remove json
        data: any;
      };
}
interface IWebhookResponse {
  status: number;
  json?: any;
}

function parserHeader(headers: IHeader[]) {
  if (!headers) return {};
  return headers.reduce((pre, next) => {
    const { key, value } = next;
    if (key.toLowerCase() === 'content-type') {
      pre['content-type'] = value;
    } else {
      pre[key] = value;
    }
    return pre;
  }, {} as any);
}

export async function sendRequest(request: IWebhookRequest): Promise<IActionResponse<any>> {
  const { method, headers, url, body } = request;
  let contentType;
  let bodyData;
  const formData = new FormData();
  if (body) {
    switch (body.type) {
      case 'form-data':
        contentType = 'application/x-www-form-urlencoded';
        body.formData.forEach((item) => {
          formData.append(item.key, item.value);
        });
        bodyData = formData;
        break;
      case 'json':
        contentType = 'application/json';
        bodyData = body.data;
        break;
      case 'raw':
        contentType = body.format === 'json' ? 'application/json' : 'text/plain';
        bodyData = body.data;
        break;
      default:
        contentType = 'application/json';
    }
  }

  const agentOpts = url.startsWith('https') ? { agent: new https.Agent({ rejectUnauthorized: false }) } : {};
  const newReqData = {
    // disable https certificate verification
    ...agentOpts,
    method,
    headers: { 'content-type': contentType, ...parserHeader(headers) },
  };
  if (['post', 'patch', 'put', 'delete'].includes(method.toLowerCase())) {
    newReqData['body'] = bodyData;
  }

  try {
    const res = await fetch(url, newReqData);
    let respJson;
    try {
      respJson = await res.json();
    } catch (error) {
      console.log('error', error);
    }
    if (res.status >= 200 && res.status < 300) {
      const data: ISuccessResponse<IWebhookResponse> = {
        data: {
          status: res.status,
          json: respJson,
        },
      };
      return {
        success: true,
        code: ResponseStatusCodeEnums.Success,
        data: data,
      };
    }
    const data: IErrorResponse = {
      errors: [
        {
          message: `${res.status} ${res.statusText}`,
        },
      ],
    };
    return {
      success: false,
      data,
      code: res.status,
    };
  } catch (error: any) {
    // network error
    const res: IErrorResponse = {
      errors: [
        {
          message: error.message,
        },
      ],
    };
    return {
      success: false,
      data: res,
      code: ResponseStatusCodeEnums.ServerError,
    };
  }
}
