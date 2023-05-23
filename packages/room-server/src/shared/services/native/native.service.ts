import { Injectable } from '@nestjs/common';
import type { NativeModule, DatasheetPackResponse } from '@apitable/room-native-api';
import { isDevMode } from 'app.environment';
import { DEFAULT_EDITOR_PERMISSION, DEFAULT_MANAGER_PERMISSION, DEFAULT_PERMISSION, DEFAULT_READ_ONLY_PERMISSION, IRecordMap } from '@apitable/core';
import type { IAuthHeader, IFetchDataOptions, IFetchDataOriginOptions, IFetchDataPackOptions, IOssConfig } from 'shared/interfaces';
import { HttpService } from '@nestjs/axios';
import { CommonException, PermissionException, ServerException } from 'shared/exception';
import { Logger } from 'winston';
import { EnvConfigKey, InjectLogger, USE_NATIVE_MODULE } from 'shared/common';
import { responseCodeHandler } from '../rest/response.code.handler';
import { EnvConfigService } from '../config/env.config.service';
import { DatasheetPack } from 'database/interfaces';
import { IBaseException } from 'shared/exception/base.exception';

@Injectable()
export class NativeService {
  private nativeModule: NativeModule | undefined;

  constructor(httpService: HttpService, envConfigService: EnvConfigService, @InjectLogger() private readonly logger: Logger) {
    if (USE_NATIVE_MODULE) {
      this.nativeModule = require('@apitable/room-native-api').NativeModule.create(
        isDevMode,
        httpService.axiosRef.defaults.baseURL!,
        envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig,
        {
          DEFAULT_PERMISSION,
          DEFAULT_MANAGER_PERMISSION,
          DEFAULT_EDITOR_PERMISSION,
          DEFAULT_READ_ONLY_PERMISSION,
        },
      );
      process.on('exit', () => {
        this.nativeModule!.destroy();
        this.nativeModule = undefined;
      });
    }
  }

  getRecords(dstId: string, recordIds: string[] | null, isDeleted: boolean, withComment: boolean): Promise<IRecordMap> | IRecordMap {
    return this.nativeModule!.getRecords(dstId, recordIds, isDeleted, withComment);
  }

  /// Load datasheet pack. The response buffer will be directly returned to the front-end without further serialization.
  async fetchDataPackResponse(
    source: string,
    dstId: string,
    auth: IAuthHeader,
    origin: IFetchDataOriginOptions,
    options?: IFetchDataPackOptions,
  ): Promise<DatasheetPackResponse> {
    const result = await this.nativeModule!.fetchDatasheetPackResponse(source, dstId, auth, origin, options);
    if ('response' in result) {
      return result;
    }
    this.handleDataPackError(dstId, auth, result, options?.metadataException);
  }

  async fetchDataPack(
    source: string,
    dstId: string,
    auth: IAuthHeader,
    origin: IFetchDataOriginOptions,
    options?: IFetchDataOptions,
  ): Promise<DatasheetPack> {
    const result = await this.nativeModule!.fetchDatasheetPack(source, dstId, auth, origin, options);
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
