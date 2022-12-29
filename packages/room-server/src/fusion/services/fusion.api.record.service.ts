import { Injectable } from '@nestjs/common';
import { DatasheetRecordRepository } from 'database/repositories/datasheet.record.repository';
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
