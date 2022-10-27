import { IField } from '@apitable/core';
import { ApiTipId } from '../shared/exception';
import { IFieldValue } from '../shared/interfaces';

/**
 * <p>
 * 字段验证接口
 * </p>
 * @author Zoe zheng
 * @date 2020/8/6 4:03 下午
 */
export interface IFieldValidatorInterface {

  /**
   * 返回string 为验证不通过，返回null为验证通过
   * @param fieldValue 字段值
   * @param field 字段属性
   * @param extra 提示额外字段
   * @author Zoe Zheng
   * @date 2020/8/6 4:03 下午
   */
  validate(fieldValue: IFieldValue, field: IField, extra?: { [key: string]: string });

  throwException(field: IField, tipId: ApiTipId, value?: any, property?: string);
}
