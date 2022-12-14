import fetch from 'node-fetch';
import {ResponseStatusCodeEnums} from "../enum/response.status.code.enums";
import {IActionResponse, IErrorResponse, ISuccessResponse} from "../interface/action.response";
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
    
    const failRes = result as ILarkMsgFailResponse;
    const res: IErrorResponse = {
      errors: [{
        message: `[${failRes.code}] ${failRes.msg}`
      }]
    };
    // lark return result, but not success, means client input error or request too frequently, use lark response as error message.
    return {
      success: false,
      data: res,
      code: ResponseStatusCodeEnums.ClientError
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