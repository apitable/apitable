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

import nodemailer from 'nodemailer';
import { marked } from 'marked';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { ResponseStatusCodeEnums } from '../enum/response.status.code.enums';
import { IActionResponse, IErrorResponse } from '../interface/action.response';

interface IMailServer {
  domain: string,
  port: string,
}

interface IMailMessageRequest {
  mailServer?: IMailServer;
  server?: string;
  port?: string;
  account: string;
  password: string;
  to: string;
  subject: string;
  message: string;
  template: string;
}

interface IMailMessageResponse {
  message: string;
}

const jsdomWindow = new JSDOM('').window;
const purify = DOMPurify(jsdomWindow as any);

export async function sendMail(request: IMailMessageRequest): Promise<IActionResponse<IMailMessageResponse>> {
  const { mailServer, server, port, account, password, to, subject, message, template } = request;
  const transporter = nodemailer.createTransport({
    host: mailServer?.domain || server,
    port: mailServer ? Number(mailServer.port) : Number(port),
    auth: {
      user: account,
      pass: password,
    }
  });
  transporter.use('compile', (mail, callback) => {
    if (mail.data.text) {
      // Marked does not sanitize the output HTML.
      // If you are processing potentially unsafe strings, it's important to filter for possible XSS attacks.
      // Some filtering options include DOMPurify (recommended), js-xss, sanitize-html and insane on the output HTML!
      mail.data.html = purify.sanitize(marked.parse(mail.data.text as string));
    }
    callback();
  });

  try {
    const info = await transporter.sendMail({
      from: account,
      to,
      subject,
      text: `${message}${template}`,
    });

    return {
      success: true,
      code: ResponseStatusCodeEnums.Success,
      data: {
        data: {
          message: info.response,
        },
      },
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
  } finally {
    transporter.close();
  }
}
