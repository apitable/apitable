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

import { ApiTipConstant, cellValueToImageSrc, IAttachmentValue } from '@apitable/core';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import FormData from 'form-data';
import * as fs from 'fs';
import { ApiResponse } from 'fusion/vos/api.response';
import { I18nService } from 'nestjs-i18n';
import * as path from 'path';
import pump from 'pump';
import { lastValueFrom } from 'rxjs';
import { FILE_UPLOAD_TMP_PATH, InjectLogger, JavaApiPath, USER_HTTP_DECORATE } from 'shared/common';
import { AttachmentTypeEnum } from 'shared/enums/attachment.enum';
import { ApiException } from 'shared/exception';
import { IdWorker } from 'shared/helpers';
import { IAuthHeader } from 'shared/interfaces';
import { IFileInterface } from 'shared/interfaces/file.interface';
import { JavaService } from 'shared/services/java/java.service';
import { Logger } from 'winston';
import { AttachmentDto } from '../dtos/attachment.dto';

@Injectable()
export class AttachmentService {
  constructor(
    private readonly javaService: JavaService,
    // private readonly fusionApiService: FusionApiService,
    private readonly httpService: HttpService,
    @InjectLogger() private readonly logger: Logger,
    private readonly i18n: I18nService,
  ) {
  }

  /**
   *
   * @param dstId
   * @param file
   * @param auth
   * @returns
   */
  public async uploadAttachment(dstId: string, file: IFileInterface, auth: IAuthHeader): Promise<AttachmentDto> {
    if (!file) throw ApiException.tipError(ApiTipConstant.api_upload_invalid_file);
    const newPath = path.join(file.destination, file.originalName);
    let res;
    try {
      fs.renameSync(file.path, newPath);
      const form = new FormData();
      const upstream = fs.createReadStream(newPath);
      await form.append('file', upstream, {
        filename: file.originalName,
        contentType: file.mimetype,
      });
      await form.append('nodeId', dstId);
      await form.append('type', AttachmentTypeEnum.DATASHEET_ATTACH.toString());
      res = await this.javaService.setHeaders(auth, form.getHeaders()).post(JavaApiPath.UPLOAD_ATTACHMENT, form);
      upstream.close();
      this.unlinkFile(newPath);
    } catch (e) {
      this.unlinkFile(newPath);
      this.logger.error('Uploading attachment failed', { e });
      throw ApiException.tipError(ApiTipConstant.api_server_error, { value: 1 });
    }

    if (!res) throw ApiException.tipError(ApiTipConstant.api_server_error, { value: 1 });
    if (res.code && res.code === JavaService.SUCCESS_CODE) {
      return {
        token: res.data.token,
        mimeType: res.data.mimeType,
        preview: res.data.preview ? res.data.preview : undefined,
        size: res.data.size,
        height: res.data?.height,
        width: res.data?.width,
        name: res.data.name,
        url: cellValueToImageSrc(res.data as IAttachmentValue),
      };
    }
    throw ApiException.tipError(ApiTipConstant.api_upload_attachment_error, { message: res.message });
  }

  /**
   * delete file
   * @param file relative path + file name
   * @return
   * @author Zoe Zheng
   * @date 2020/8/12 11:50 am
   */
  public unlinkFile(file: string) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }

  /**
   * Save files in directory
   * @return
   * @author Zoe Zheng
   * @date 2020/9/1 4:05 pm
   */
  getFileUploadHandler(_dstId: string, newFiles: IFileInterface[], req: FastifyRequest, reply: FastifyReply) {
    return async(field: string, file: pump.Stream, filename: string, _encoding: string, mimetype: string): Promise<void> => {
      if (!filename) {
        const err = ApiException.tipError(ApiTipConstant.api_upload_invalid_file_name);
        const errMsg = await this.i18n.translate(err.message, {
          lang: req[USER_HTTP_DECORATE]?.locale,
        });
        reply.statusCode = err.getTip().statusCode;
        return reply.send(ApiResponse.error(errMsg, err.getTip().code));
      }
      const newName = IdWorker.nextId().toString();
      const filePath = path.join(FILE_UPLOAD_TMP_PATH, newName);
      if (!fs.existsSync(FILE_UPLOAD_TMP_PATH)) {
        fs.mkdirSync(FILE_UPLOAD_TMP_PATH);
      }
      await pump(file, fs.createWriteStream(filePath)); // File path
      newFiles.push({ filename: newName, fieldName: field, destination: FILE_UPLOAD_TMP_PATH, originalName: filename, mimetype, path: filePath });
    };
  }

  async getContentDisposition(url: string): Promise<string> {
    const response = await lastValueFrom(this.httpService.head(url));
    return response!.headers['content-disposition']!;
  }
}
