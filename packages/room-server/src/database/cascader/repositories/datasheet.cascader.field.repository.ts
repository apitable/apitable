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
import { EntityRepository, Repository } from 'typeorm';
import { DatasheetCascaderFieldEntity } from '../entities/datasheet.cascader.field.entity';

@EntityRepository(DatasheetCascaderFieldEntity)
export class DatasheetCascaderFieldRepository extends Repository<DatasheetCascaderFieldEntity> {

  public async selectRecordData(spaceId: string, datasheetId: string, fieldId: string): Promise<DatasheetCascaderFieldEntity[]> {
    return await this.find({
      select: ['linkedRecordData', 'linkedRecordId'],
      where: {
        spaceId,
        datasheetId,
        fieldId,
        isDeleted: false,
      },
    });
  }

}
