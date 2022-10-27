import fetch from 'node-fetch';
import { IActionResponse, IErrorResponse, ResponseStatusCodeEnums } from '../interface';

interface IWecomMsgRequest {
  type: string;
  content: string;
  webhookUrl: string;
}

interface IWecomMsgResponse {
  errmsg: string,
  errcode: number
}

export async function sendWecomMsg(reqData: IWecomMsgRequest): Promise<IActionResponse<any>> {
  const { type, content, webhookUrl } = reqData;

  let data = {};
  switch (type) {
    case 'text':
      data = {
        text: {
          content: content
        },
        msgtype: 'text'
      };
      break;
    case 'markdown':
      data = {
        msgtype: 'markdown',
        markdown: {
          content: content
        }
      };
      break;
  }
  try {
    const res = await fetch(webhookUrl, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    });
    const resp: IWecomMsgResponse = await res.json();
    if (resp.errcode === 0) {
      return {
        success: true,
        code: ResponseStatusCodeEnums.Success,
        data: {
          data: resp
        }
      };
    }
    return {
      success: false,
      code: ResponseStatusCodeEnums.ClientError,
      data: {
        errors: [{
          message: resp.errmsg
        }]
      }
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
