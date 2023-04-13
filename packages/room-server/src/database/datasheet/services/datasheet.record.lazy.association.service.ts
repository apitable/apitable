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

import { IRecordMap, IRecord, IRecordDependencies, IRecordDependency, ILinkIds } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { IdWorker } from 'shared/helpers';
import { ICellValueMap } from 'shared/interfaces';
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

  public fillInRelatedRecordAssociations(spaceId: string, datasheetId: string, currentRecordLazyAssociations: DatasheetRecordLazyAssociationEntity[]
    , fieldIdToLinkDstIdMap: Map<string, string>, recordMap: IRecordMap, mainDatasheet: boolean): void{
    Object.keys(recordMap).forEach((recordId: string) => {
      const RECORD_LAZY_ASSOCIATION_MODE = !!process.env.RECORD_LAZY_ASSOCIATION_MODE;
      if (!RECORD_LAZY_ASSOCIATION_MODE) {
        return;
      }
      const record: IRecord|undefined = recordMap[recordId];
      if (!record) {
        return;
      }
      const depends: IRecordDependencies = this.getDepends(record.data, fieldIdToLinkDstIdMap);
      if (Object.keys(depends).length === 0) {
        return;
      }
      if (mainDatasheet) {
        const association: DatasheetRecordLazyAssociationEntity = {
          spaceId,
          dstId: datasheetId,
          recordId: record.id,
          depends,
        } as DatasheetRecordLazyAssociationEntity;
        currentRecordLazyAssociations.push(association);
      } else {
        currentRecordLazyAssociations.forEach((association: DatasheetRecordLazyAssociationEntity) => {
          Object.keys(association?.depends).forEach((fieldId: string) => {
            const recordDependencies = association.depends[fieldId];
            let related: boolean = false;
            recordDependencies?.forEach((depend: IRecordDependency) => {
              const { recordIds } = depend;
              if (recordIds.includes(recordId)) {
                related = true;
              }
            });
            if (related) {
              Object.keys(depends).forEach((fieldId: string) => {
                const dependencies: IRecordDependency[]|undefined = depends[fieldId];
                if (dependencies) {
                  recordDependencies?.push(...dependencies);
                }
              });
            }
          });
        });
      }
    });
  }

  public getDepends(recordData: ICellValueMap, fieldIdToLinkDstIdMap: Map<string, string>): IRecordDependencies {
    const depends: IRecordDependencies = {};
    Object.keys(recordData).forEach((fieldId: string) => {
      const datasheetId = fieldIdToLinkDstIdMap.get(fieldId);
      if (!datasheetId) return;
      const recordIds = recordData[fieldId] as ILinkIds;
      if (recordIds.length > 0) {
        depends[fieldId] = [{ datasheetId, recordIds }];
      }
    });
    return depends;
  }

}
