import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ApiException, ApiTipId } from '../../exception/api.exception';
import { IValidationPipeOptions } from '../../interfaces';
import * as qs from 'qs';
import { ApiTipConstant } from '@apitable/core';

/**
 * Global parameter validation pipe
 * @author Zoe zheng
 * @date 2020/8/7 6:11 PM
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  private readonly options;
  constructor(options?: IValidationPipeOptions) {
    this.options = options;
  }

  /**
   * validate parameters
   * @param value parameter value
   * @param type parameter type
   * @param metatype parameter metatype
   * @return
   * @author Zoe Zheng
   * @date 2020/8/4 4:05 PM
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
      throw ApiException.tipError(ApiTipConstant.api_param_default_error);
    }
    // return the first error
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
   * get parameters that need to be validated
   * @param metaType parameters metaType
   * @return
   * @author Zoe Zheng
   * @date 2020/8/4 4:05 PM
   */
  private static toValidate(metaType: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }
}
