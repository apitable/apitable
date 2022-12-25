/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable } from '@nestjs/common';
import { CollaCommandName, ICollaCommandOptions, IField, IFieldMap, IRecordMap } from '@apitable/core';

/**
 * @author Zoe zheng
 * @date 2020/8/20 11:23 AM
 */
@Injectable()
export class CommandOptionsService {
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
