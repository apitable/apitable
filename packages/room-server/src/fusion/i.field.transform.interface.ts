import { IFieldRoTransformOptions, IFieldValue, IFieldVoTransformOptions } from '../shared/interfaces';
import { ICellValue, IField } from '@apitable/core';

/**
 * <p>
 * 字段转换接口
 * </p>
 * @author Zoe zheng
 * @date 2020/8/7 12:24 下午
 */
export interface IFieldTransformInterface {
  /**
   * 转换成写入数据库的标准值
   * @param fieldValue 字段值
   * @param field 字段属性
   * @param options 全部字段属性和spaceId
   * @return ICellValue
   * @author Zoe Zheng
   * @date 2020/8/6 4:03 下午
   */
  roTransform(fieldValue: IFieldValue, field: IField, options: IFieldRoTransformOptions): ICellValue | Promise<ICellValue>;

  /**
   * api返回转换
   * @param fieldValue 字段值
   * @param field 字段属性
   * @param options 全部字段属性和对应记录,全局成员map，避免循环查找
   * @return IFieldValue
   * @author Zoe Zheng
   * @date 2020/8/6 4:03 下午
   */
  voTransform(fieldValue: IFieldValue, field: IField, options?: IFieldVoTransformOptions): IFieldValue | Promise<IFieldValue>;
}
