import { Injectable } from '@nestjs/common';
import { ApiException, ApiTipId } from '../../shared/exception';
import { difference } from 'lodash';
import { DatasheetRecordRepository } from '../../datasheet/repositories/datasheet.record.repository';

@Injectable()
export class FusionApiRecordService {
  constructor(private readonly recordRepository: DatasheetRecordRepository) {
  }

  /**
   * 检测recordId和数表ID是否匹配
   * @param dstId 数表ID
   * @param recordIds recordID
   * @param error 错误提示
   * @throws ApiException
   * @author Zoe Zheng
   * @date 2020/9/10 7:10 下午
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
