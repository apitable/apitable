import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ApiException, ApiTipId } from '../../exception/api.exception';
import { IValidationPipeOptions } from '../../interfaces';
import * as qs from 'qs';

/**
 * <p>
 * 全局参数验证器
 * </p>
 * @author Zoe zheng
 * @date 2020/8/7 6:11 下午
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  private readonly options;
  constructor(options?: IValidationPipeOptions) {
    this.options = options;
  }

  /**
   * 参数校验
   * @param value 参数
   * @param type 参数类型
   * @param metatype 参数值类型
   * @return
   * @author Zoe Zheng
   * @date 2020/8/4 4:05 下午
   */
  async transform(value: any, { type, metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return value;
    }
    let object;
    try {
      object = plainToClass(metatype, qs.parse(value, {
        allowDots: true,
        parseArrays: true,
      }));
    } catch (e) {
      throw ApiException.tipError('api_param_default_error');
    }
    // 只返回第一个错误
    const errors = await validate(object);
    if (errors.length) {
      const validationError = this.getSingleError(errors);
      const messageId = Object.values(validationError.constraints)[0] as ApiTipId;
      let contexts = {};
      if (validationError.contexts) {
        contexts = Object.values(validationError.contexts)[0];
      }
      throw ApiException.tipError(messageId, { ...contexts });
    }
    return object;
  }

  private getSingleError(errors: ValidationError[]): ValidationError {
    const validationError: ValidationError = errors[0];
    if (validationError.constraints) {
      return validationError;
    }
    return this.getSingleError(validationError.children);
  }

  /**
   *
   * 获取需要验证的参数
   * @param metaType 参数类型
   * @return
   * @author Zoe Zheng
   * @date 2020/8/4 4:05 下午
   */
  private static toValidate(metaType: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }
}
