import { Injectable } from '@nestjs/common';
import { CollaCommandName, ICollaCommandOptions, IField, IFieldMap, IRecordMap } from '@vikadata/core';
import { ICommandOptionsInterface } from 'modules/services/command/i.command.options.interface';

/**
 * <p>
 * 实现类
 * </p>
 * @author Zoe zheng
 * @date 2020/8/20 11:23 上午
 */
@Injectable()
export class CommandOptionsService implements ICommandOptionsInterface {
  getSetRecordsOptions(dstId: string, records: IRecordMap, fieldMap: IFieldMap): ICollaCommandOptions {
    const fieldData = Object.values(records).reduce<any[]>((pre, cur) => {
      Object.keys(fieldMap).forEach(fieldId => {
        if (cur.data && cur.data.hasOwnProperty(fieldId)) {
          pre.push({
            recordId: cur.id,
            fieldId,
            field: fieldMap[fieldId],
            value: cur.data[fieldId],
          });
        }
      });
      return pre;
    }, []);
    return {
      cmd: CollaCommandName.SetRecords,
      datasheetId: dstId,
      data: fieldData
    };
  }

  getAddFieldOptions(dstId: string, fields: IField[], index: number): ICollaCommandOptions {
    const addFieldsOptions = fields.map(field => {
      return {
        index: index++,
        data: field,
      };
    });
    return {
      cmd: CollaCommandName.AddFields,
      data: addFieldsOptions,
      datasheetId: dstId,
    };
  }

  getSetFieldAttrOptions(datasheetId: string, field: IField, deleteBrotherField?: boolean): ICollaCommandOptions {
    return {
      cmd: CollaCommandName.SetFieldAttr,
      datasheetId,
      fieldId: field.id,
      deleteBrotherField,
      data: field,
    };
  }
}
