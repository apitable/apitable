import fetch from 'node-fetch';
import { IActionResponse, ISuccessResponse, IErrorResponse, ResponseStatusCodeEnums } from '../interface';
interface ILarkMsgRequest {
  type: 'text';
  content: string;
  webhookUrl: string;
}

interface ILarkMsgSuccessResponse {
  Extra: any | null;
  StatusCode: number;
  StatusMessage: 'success' | string;
}

interface ILarkMsgFailResponse {
  code: number;
  msg: string;
}

type ILarkMsgResponse = ILarkMsgFailResponse | ILarkMsgSuccessResponse;

export async function sendLarkMsg(request: ILarkMsgRequest): Promise<IActionResponse<any>> {
  const { type, content, webhookUrl } = request;
  const body = JSON.stringify({
    msg_type: type,
    content: {
      [type]: content
    }
  });

  try {
    const resp = await fetch(webhookUrl.trim(), {
      body,
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    });
    const result: ILarkMsgResponse = await resp.json();
    if ((result as ILarkMsgSuccessResponse).StatusCode === 0) {
      const res: ISuccessResponse<any> = {
        data: result
      };
      return {
        success: true,
        data: res,
        code: ResponseStatusCodeEnums.Success
      };
    }
    console.log('lark msg error', resp.status, result);
    const failRes = result as ILarkMsgFailResponse;
    const res: IErrorResponse = {
      errors: [{
        message: `[${failRes.code}] ${failRes.msg}`
      }]
    };
    // 飞书返回了结果，但是不是成功的，表明客户端输入有误/请求频率过高,具体提示以飞书返回的为准。
    return {
      success: false,
      data: res,
      code: ResponseStatusCodeEnums.ClientError
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