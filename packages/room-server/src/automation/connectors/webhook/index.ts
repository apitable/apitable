import fetch from 'node-fetch';
import FormData from 'form-data';
import https from 'https';
import { IActionResponse, IErrorResponse, ISuccessResponse, ResponseStatusCodeEnums } from '../interface';

interface IHeader {
  key: string;
  value: string;
}

interface IWebhookRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers: IHeader[];
  url: string;
  body?: {
    type: 'form-data';
    formData: {
      key: string;
      value: any;
    }[];
  } | {
    format: 'json' | 'text';
    type: 'json' | 'raw'; // TODO: remove json
    data: any;
  }
}
interface IWebhookResponse {
  status: number;
  json?: any;
}

function parserHeader(headers: IHeader[]) {
  if (!headers) return {};
  return headers.reduce((pre, next) => {
    const { key, value } = next;
    pre[key] = value;
    return pre;
  }, {} as any);
}

export async function sendRequest(request: IWebhookRequest): Promise<IActionResponse<any>> {
  const { method, headers, url, body } = request;
  let contentType;
  let bodyData = {};
  const formData = new FormData();
  if (body) {
    switch (body.type) {
      case 'form-data':
        contentType = 'application/x-www-form-urlencoded';
        body.formData.forEach(item => {
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
    const data: ISuccessResponse<IWebhookResponse> = {
      data: {
        status: res.status,
        json: respJson
      }
    };
    return {
      success: true,
      code: ResponseStatusCodeEnums.Success,
      data: data
    };
  } catch (error: any) {
    // network error
    const res: IErrorResponse = {
      errors: [{
        message: error.message
      }]
    };
    return {
      success: false,
      data: res,
      code: ResponseStatusCodeEnums.ServerError
    };
  }
}