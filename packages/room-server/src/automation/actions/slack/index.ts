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
import { ResponseStatusCodeEnums } from '../enum/response.status.code.enums';
import { IActionResponse, IErrorResponse } from '../interface/action.response';

interface ISlackMessageRequest {
  type: 'text' | 'markdown';
  content: string;
  webhookUrl: string;
}

export async function sendSlackMessage(request: ISlackMessageRequest): Promise<IActionResponse<string>> {
  const { type, content, webhookUrl } = request;
  const body = JSON.stringify({
    text: content,
    mrkdwn: type === 'markdown',
  });
  try {
    const response = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body,
    });
    const responseBody = response.clone();
    const result = await responseBody.text();
    if (result === 'ok') {
      return {
        success: true,
        code: ResponseStatusCodeEnums.Success,
        data: {
          data: result,
        },
      };
    }
    return {
      success: false,
      data: {
        errors: [
          {
            message: result,
          },
        ],
      },
      code: ResponseStatusCodeEnums.ServerError,
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
