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
import { DatasheetRecordRepository } from 'database/datasheet/repositories/datasheet.record.repository';
import { difference } from 'lodash';
import { ApiException, ApiTipId } from 'shared/exception';

@Injectable()
export class FusionApiRecordService {
  constructor(
    private readonly recordRepository: DatasheetRecordRepository
  ) {
  }

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
    const dbRecordIds = await this.recordRepository.selectIdsByDstIdAndRecordIds(dstId, recordIds);
    if (!dbRecordIds?.length) {
      throw ApiException.tipError(error, { recordId: recordIds.join(', ') });
    }
    const diffs = difference(recordIds, dbRecordIds);
    if (diffs.length) {
      throw ApiException.tipError(error, { recordId: diffs.join(',') });
    }
  }
}
