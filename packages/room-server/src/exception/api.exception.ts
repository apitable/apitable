import { HttpException } from '@nestjs/common';
import { ApiTipConfig, ApiTipConstant, Strings, t } from '@vikadata/core';
import { ServerException } from 'exception/server.exception';
import { IApiErrorTip } from 'interfaces';
import { CommonException } from './common.exception';

export type ApiTipId = keyof typeof ApiTipConstant;

/**
 * api 错误属性接口定义
 */
export interface IApiTip {
  // 错误返回的编码
  code: number;
  // 错误ID
  id: string;
  // 是否记录用量
  isRecordTimes?: boolean;
  // 错误信息,对应strings表的ID
  message?: string;
  // http status 状态码
  statusCode: number;
}

/**
 * <p>
 * fusionAPi异常处理
 * </p>
 * @author Zoe zheng
 * @date 2020/10/13 6:37 下午
 */
export class ApiException extends HttpException {
  private readonly extra: { [key: string]: any };
  private readonly tip: IApiTip;
  private readonly code: number;

  constructor(tipId: ApiTipId, extra?: any) {
    super(ApiTipConfig.api.tips[tipId].id, ApiTipConfig.api.tips[tipId].statusCode);
    this.tip = ApiTipConfig.api.tips[tipId];
    this.extra = extra;
  }

  public static tipError(tipId: ApiTipId, extra?: { [key: string]: any }) {
    return new ApiException(tipId, extra);
  }

  /**
   * 返回异常状态信息
   */
  public getMessage(): string {
    return this.message;
  }

  /**
   * 返回额外信息
   */
  public getExtra() {
    return this.extra;
  }

  /**
   * 返回tip
   */
  public getTip(): IApiTip {
    return this.tip;
  }

  // 保留之前的错误，兼容旧数据
  static init(code: number, message: string) {
    return new CommonException(code, message);
  }

  static error(tips: IApiErrorTip[] | IApiErrorTip) {
    const error: IApiErrorTip = Array.isArray(tips) ? tips[0] : tips;
    const tip = ApiTipConfig[error.tipId];
    let message: string = ApiException.message(error.tipId, error?.value, error?.property);
    if (Array.isArray(tips)) {
      const messages = tips.map(v => {
        return ApiException.message(v.tipId, v?.value, v?.property);
      });
      message = messages.join(',');
    }
    return new ServerException(ApiException.init(tip.code, message), tip.statusCode);
  }

  static message(tipId: string, value?: any, property?: any) {
    return t(Strings[tipId], { value, property });
  }
}
