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

import {
  databus, FieldType,
  IBaseDatasheetPack,
  IResourceOpsCollect,
  IServerDatasheetPack,
  IUnitValue,
  IUserValue
} from '@apitable/core';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { UnitService } from 'unit/services/unit.service';

export class CascaderDataStorageProvider implements databus.IDataStorageProvider {
  constructor(
    private readonly datasheetService: DatasheetService,
    private readonly unitService: UnitService,
  ) {}

  public async loadDatasheetPack(dstId: string, _options: databus.ILoadDatasheetPackOptions): Promise<IServerDatasheetPack | null> {
    const dstIds = [dstId];
    const packs: IBaseDatasheetPack[] = [];
    for (const dstId of dstIds) {
      const basePack = await this.datasheetService.getBasePacks(dstId, {
        // if all linked datasheet is included. Default to true
        includeLink: true,
      });
      packs.push(...basePack);
    }
    const foreignDatasheetMap: { [dstId: string]: IBaseDatasheetPack } = {};
    for (const pack of packs) {
      foreignDatasheetMap[pack.datasheet.id] = pack;
    }
    // NOTE the first data pack of `packs` is always the datasheet specified by `dstId`.
    delete foreignDatasheetMap[packs[0]!.datasheet.id];
    const combine: (IUnitValue | IUserValue)[] = [];
    // Batch query member info
    const datasheetBaseInfo = await this.datasheetService.getDatasheet(dstId);
    const spaceId = datasheetBaseInfo?.spaceId;
    const fieldMap = packs[0]!.snapshot.meta.fieldMap;
    for (const fieldId in fieldMap) {
      const field = fieldMap[fieldId]!;
      if (field.type === FieldType.Member && spaceId) {
        const unitIds = field.property.unitIds;
        if (unitIds && unitIds.length > 0) {
          const unitMap = await this.unitService.getUnitInfo(spaceId, Array.from(unitIds));
          combine.push(...unitMap);
        }
      }
    }
    return {
      ...packs[0]!,
      units: combine,
      foreignDatasheetMap,
    };
  }

  public loadDashboardPack(): never {
    throw new Error('unreachable');
  }

  public saveOps(_ops: IResourceOpsCollect[], _options: databus.ISaveOpsOptions) {
    throw new Error('Method not implemented.');
  }

  async nestRoomChangeFromRust(_roomId: string, _data: any) {
  }
}
