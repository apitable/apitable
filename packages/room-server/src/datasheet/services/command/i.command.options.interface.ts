import { ICollaCommandOptions, IField, IFieldMap, IRecordMap } from '@apitable/core';

export interface ICommandOptionsInterface {
  /**
   * 获取添加列的command options
   *
   * @param dstId 数表id
   * @param fields 需要添加的列
   * @param index 开始位置 默认为最后
   * @return IAddFieldsOptions
   * @author Zoe Zheng
   * @date 2021/3/24 4:59 下午
   */
  getAddFieldOptions(dstId: string, fields: IField[], index: number): ICollaCommandOptions;

  /**
   * 获取修改单元格的options
   *
   * @param dstId 数表ID
   * @param records 需要写入的数据
   * @param fieldMap 写入数据对应的列
   * @return ISetRecordsOptions
   * @author Zoe Zheng
   * @date 2021/3/24 5:21 下午
   */
  getSetRecordsOptions(dstId: string, records: IRecordMap, fieldMap: IFieldMap): ICollaCommandOptions;

  /**
   * 获取修改列的options
   *
   * @param datasheetId 数表ID
   * @param field 需要修改的列
   * @param deleteBrotherField 是否删除关联表的列
   * @return
   * @author Zoe Zheng
   * @date 2021/3/26 10:23 上午
   */
  getSetFieldAttrOptions(datasheetId: string, field: IField, deleteBrotherField?: boolean): ICollaCommandOptions;
}
