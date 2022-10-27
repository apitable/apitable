import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { cellValueToImageSrc, IAttachmentValue } from '@apitable/core';
import { FILE_UPLOAD_TMP_PATH, InjectLogger, JavaApiPath, USER_HTTP_DECORATE } from '../../../shared/common';
import { AttachmentTypeEnum } from 'shared/enums/attachment.enum';
import { ApiException } from '../../../shared/exception/api.exception';
import FormData from 'form-data';
import * as fs from 'fs';
import { IdWorker } from '../../../shared/helpers';
import { IAuthHeader } from '../../../shared/interfaces';
import { IFileInterface } from 'shared/interfaces/file.interface';
import { ApiResponse } from '../../../fusion/vos/api.response';
import { AttachmentDto } from '../../dtos/attachment.dto';
import { FusionApiService } from 'fusion/services/fusion.api.service';
import { JavaService } from 'shared/services/java/java.service';
import { I18nService } from 'nestjs-i18n';
import * as path from 'path';
import pump from 'pump';
import { Logger } from 'winston';

@Injectable()
export class AttachmentService {
  constructor(
    private readonly javaService: JavaService,
    private readonly fusionApiService: FusionApiService,
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
    if (!file) throw ApiException.tipError('api_upload_invalid_file');
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
      this.logger.error(e.stack || e, ['上传附件异常']);
      throw ApiException.tipError('api_server_error', { value: 1 });
    }

    if (!res) throw ApiException.tipError('api_server_error', { value: 1 });
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
    throw ApiException.tipError('api_upload_attachment_error', { message: res.message });
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
  getFileUploadHandler(dstId: string, newFiles: IFileInterface[], req, reply) {
    return async(field, file, filename, encoding, mimetype) => {
      if (!filename) {
        const err = ApiException.tipError('api_upload_invalid_file_name');
        const errMsg = await this.i18n.translate(err.message, {
          lang: req[USER_HTTP_DECORATE]?.locale,
        });
        reply.status = err.getTip().statusCode;
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
    const response = await this.httpService.head(url).toPromise();
    return response.headers['content-disposition'];
  }
}
