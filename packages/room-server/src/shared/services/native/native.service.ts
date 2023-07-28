import { Injectable } from '@nestjs/common';
import { isDevMode, useNativeModule } from 'app.environment';
import type { IAuthHeader, IFetchDataOptions, IFetchDataOriginOptions } from 'shared/interfaces';
import { HttpService } from '@nestjs/axios';
import { CommonException, PermissionException, ServerException } from 'shared/exception';
import { Logger } from 'winston';
import { InjectLogger } from 'shared/common';
import { responseCodeHandler } from '../rest/response.code.handler';
import { DatasheetPack } from 'database/interfaces';
import { IBaseException } from 'shared/exception/base.exception';

@Injectable()
export class NativeService {
  constructor(httpService: HttpService, @InjectLogger() private readonly logger: Logger) {
    if (useNativeModule) {
      require('@apitable/databus').init(isDevMode, httpService.axiosRef.defaults.baseURL!);
      process.on('exit', () => {
        require('@apitable/databus').unInit();
      });
    }
  }

  async fetchDataPack(
    source: string,
    dstId: string,
    auth: IAuthHeader,
    origin: IFetchDataOriginOptions,
    options?: IFetchDataOptions,
  ): Promise<DatasheetPack> {
    const result = await require('@apitable/databus').fetchDatasheetPack(source, dstId, auth, origin, options);
    if ('dataPack' in result) {
      return JSON.parse(result.dataPack as any) as DatasheetPack;
    }
    this.handleDataPackError(dstId, auth, result);
  }

  private handleDataPackError(
    dstId: string,
    auth: IAuthHeader,
    error: { error: 'NODE_NOT_EXIST' | 'ACCESS_DENIED'; nodeId: string } | { error: 'REST'; code: number },
    metadataException?: IBaseException,
  ): never {
    switch (error.error) {
      case 'ACCESS_DENIED':
        throw new ServerException(PermissionException.ACCESS_DENIED);
      case 'NODE_NOT_EXIST':
        throw new ServerException(metadataException && error.nodeId === dstId ? metadataException : PermissionException.NODE_NOT_EXIST);
      case 'REST':
        responseCodeHandler(error.code!);
        break;
      default:
        this.logger.error(
          `invalid error returned from nativeModule.fetchDatasheetPackResponse ${dstId} userId:${auth.userId} response:${JSON.stringify(error)}`,
        );
        throw new ServerException(CommonException.SERVER_ERROR);
    }
  }
}
