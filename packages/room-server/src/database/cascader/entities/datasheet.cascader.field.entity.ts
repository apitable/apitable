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
import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'shared/entities/base.entity';
import { ILinkRecordData } from '../models/link.record.data';

@Entity('datasheet_cascader_field')
export class DatasheetCascaderFieldEntity extends BaseEntity {
  @Column({
    name: 'space_id',
    nullable: true,
    comment: 'Space ID',
    length: 50,
  })
  spaceId!: string;

  @Column({
    name: 'datasheet_id',
    nullable: true,
    comment: 'datasheet ID',
    length: 50,
  })
  datasheetId!: string;

  @Column({
    name: 'field_id',
    nullable: true,
    comment: 'Field ID',
    length: 50,
  })
  fieldId!: string;

  @Column('json', {
    name: 'linked_record_data',
    nullable: true,
    comment: 'the cascader source data',
  })
  linkedRecordData!: ILinkRecordData;

  @Column({
    name: 'linked_record_id',
    nullable: true,
    comment: 'the record where data from',
    length: 50,
  })
  linkedRecordId!: string;
}
