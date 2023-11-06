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

import { IRecordMap } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { DatasheetRecordService } from 'database/datasheet/services/datasheet.record.service';
import { difference } from 'lodash';
import { ApiException, ApiTipId } from 'shared/exception';

@Injectable()
export class FusionApiRecordService {
  constructor(private readonly recordService: DatasheetRecordService) {}

  /**
   * Check if recordId and table ID match
   *
   * @param dstId
   * @param recordIds
   * @param error error message
   *
   * @throws ApiException
   */
  public async validateRecordExists(dstId: string, recordIds: string[], error: ApiTipId) {
    const dbRecordIds = await this.recordService.getIdsByDstIdAndRecordIds(dstId, recordIds);
    if (!dbRecordIds?.length) {
      throw ApiException.tipError(error, { recordId: recordIds.join(', ') });
    }
    const diffs = difference(recordIds, dbRecordIds);
    if (diffs.length) {
      throw ApiException.tipError(error, { recordId: diffs.join(',') });
    }
  }

  public async validateArchivedRecordIncludes(dstId: string, recordIds: string[], error: ApiTipId) {
    const archivedRecordIds = await this.recordService.getArchivedIdsByDstIdAndRecordIds(dstId, recordIds);
    if (archivedRecordIds.size) {
      throw ApiException.tipError(error, { recordId: Array.from(archivedRecordIds).join(', ') });
    }
  }

  public getBasicRecordsByRecordIds(dstId: string, recordIds: string[]): Promise<IRecordMap> {
    return this.recordService.getBasicRecordsByRecordIds(dstId, recordIds);
  }

  public async getDeletedRecordsByDstId(dstId: string): Promise<string[]> {
    return this.recordService.getDeletedRecordsByDstId(dstId);
  }
}
