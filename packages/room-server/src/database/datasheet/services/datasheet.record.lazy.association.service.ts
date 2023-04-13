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
import { IdWorker } from 'shared/helpers';
import { DatasheetRecordLazyAssociationEntity } from '../entities/datasheet.record.lazy.association.entity';
import { DatasheetRecordLazyAssociationRepository } from '../repositories/datasheet.record.lazy.association.repository';

@Injectable()
export class DatasheetRecordLazyAssociationService {

  constructor(
    private readonly repository: DatasheetRecordLazyAssociationRepository,
  ) {}

  public async getRecordAssociations(spaceId: string, datasheetId: string, recordIds: string[]): Promise<DatasheetRecordLazyAssociationEntity[]> {
    return await this.repository.selectRecordAssociations(spaceId, datasheetId, recordIds);
  }

  public async updateRecordAssociations(associations: DatasheetRecordLazyAssociationEntity[]): Promise<void> {
    await this.repository.save(associations, { transaction: true });
  }

  public async insertRecordAssociations(associations: DatasheetRecordLazyAssociationEntity[]): Promise<void> {
    await this.repository.save(associations);
  }
  /**
   *
   * @param associations 
   * @param existingAssociations 
   * @returns 
   * 
   */
  public diffRecordAssociations(associations: DatasheetRecordLazyAssociationEntity[]
    , existingAssociations: DatasheetRecordLazyAssociationEntity[]): 
    { associationsAdded: DatasheetRecordLazyAssociationEntity[], associationsUpdated: DatasheetRecordLazyAssociationEntity[] } {
    const associationsMap = new Map<string, DatasheetRecordLazyAssociationEntity>();
    for (const association of associations) {
      associationsMap.set(`${association.spaceId}-${association.dstId}-${association.recordId}`, association);
    }
    const existingAssociationsMap = new Map<string, DatasheetRecordLazyAssociationEntity>();
    for (const association of existingAssociations) {
      existingAssociationsMap.set(`${association.spaceId}-${association.dstId}-${association.recordId}`, association);
    }
    const associationsUpdated = [];
    const associationsAdded = [];
    for (const association of associations) {
      const key = `${association.spaceId}-${association.dstId}-${association.recordId}`;
      const existingAssociation = existingAssociationsMap.get(key);
      if (!existingAssociation) {
        association.id = IdWorker.nextId().toString();
        associationsAdded.push(association);
      } else {
        if (JSON.stringify(existingAssociation?.depends) !== JSON.stringify(association.depends)) {
          existingAssociation.depends = association.depends;
          associationsUpdated.push(existingAssociation);
        }
      }
    }
    return { associationsAdded ,associationsUpdated };
  }

}
