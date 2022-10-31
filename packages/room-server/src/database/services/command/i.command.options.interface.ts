import { ICollaCommandOptions, IField, IFieldMap, IRecordMap } from '@apitable/core';

export interface ICommandOptionsInterface {
  /**
   * Get command options for AddField
   *
   * @param dstId datasheet id
   * @param fields fields to be added
   * @param index starting position, default to last
   * @return IAddFieldsOptions
   * @author Zoe Zheng
   * @date 2021/3/24 4:59 PM
   */
  getAddFieldOptions(dstId: string, fields: IField[], index: number): ICollaCommandOptions;

  /**
   * Get options for modify cells
   *
   * @param dstId datasheet ID
   * @param records records to be written
   * @param fieldMap fields corresponding to written records
   * @return ISetRecordsOptions
   * @author Zoe Zheng
   * @date 2021/3/24 5:21 PM
   */
  getSetRecordsOptions(dstId: string, records: IRecordMap, fieldMap: IFieldMap): ICollaCommandOptions;

  /**
   * Get options for modify fields
   *
   * @param datasheetId datasheet ID
   * @param field field to be modified
   * @param deleteBrotherField if field in linked datasheet should be deleted
   * @return
   * @author Zoe Zheng
   * @date 2021/3/26 10:23 PM
   */
  getSetFieldAttrOptions(datasheetId: string, field: IField, deleteBrotherField?: boolean): ICollaCommandOptions;
}
