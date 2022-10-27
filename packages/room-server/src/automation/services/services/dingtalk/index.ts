import fetch from 'node-fetch';
import { IActionResponse, IErrorResponse, ResponseStatusCodeEnums } from '../interface';

interface IDingTalkMsgRequest {
  type: string;
  content: string;
  webhookUrl: string;
  title?: string; // markdown 格式带个标题
}

interface IDingTalkMsgResponse {
  errmsg: string,
  errcode: number
}

export async function sendDingtalkMsg(request: IDingTalkMsgRequest): Promise<IActionResponse<any>> {
  console.log('sendDingTalkMsg', request);
  const { type, content, webhookUrl, title } = request;
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
          title: title,
          text: content
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
    const resp: IDingTalkMsgResponse = await res.json();
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
    // 网络层的问题视为服务端有问题。
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