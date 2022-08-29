import fetch from 'node-fetch';
import { IActionResponse, IErrorResponse, ResponseStatusCodeEnums } from '../interface';

interface IRuLiuMsgRequest {
  type: string;
  content: string;
  webhookUrl: string;
  title?: string; // markdown 格式带个标题
  baseUrl?: string; //隐藏全局配置地址
}

interface IRuLiuMsgResponse {
  errmsg: string,
  errcode: number
}

export async function sendRuLiuMsg(request: IRuLiuMsgRequest): Promise<IActionResponse<any>> {
  console.log('sendRuLiuMsg', request);
  const { type, baseUrl, content, webhookUrl, title } = request;
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
    //拼接如流地址隐式地址，baseUrl+webhookUrl
    const targetUrl = `${baseUrl}${webhookUrl}`;
    const res = await fetch(targetUrl, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    });
    const resp: IRuLiuMsgResponse = await res.json();
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