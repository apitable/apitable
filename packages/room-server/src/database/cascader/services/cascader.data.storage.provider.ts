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

import { databus, IBaseDatasheetPack, IResourceOpsCollect } from '@apitable/core';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';

export class CascaderDataStorageProvider implements databus.IDataStorageProvider {
  constructor(private readonly datasheetService: DatasheetService) {}

  public async loadDatasheetPack(dstId: string, _options: databus.ILoadDatasheetPackOptions): Promise<databus.ILoadDatasheetPackResult> {
    const dstIds = [dstId];
    const packs: IBaseDatasheetPack[] = [];
    for (const dstId of dstIds) {
      const basePack = await this.datasheetService.getBasePacks(dstId, {
        // if all linked datasheet is included. Default to true
        includeLink: false,
      });
      packs.push(...basePack);
    }
    const foreignDatasheetMap: { [dstId: string]: IBaseDatasheetPack } = {};
    for (const pack of packs) {
      foreignDatasheetMap[pack.datasheet.id] = pack;
    }
    // NOTE the first data pack of `packs` is always the datasheet specified by `dstId`.
    delete foreignDatasheetMap[packs[0]!.datasheet.id];
    return {
      datasheetPack: {
        ...packs[0]!,
        foreignDatasheetMap,
      },
    };
  }

  public saveOps(_ops: IResourceOpsCollect[], _options: databus.ISaveOpsOptions) {
    throw new Error('Method not implemented.');
  }
}
