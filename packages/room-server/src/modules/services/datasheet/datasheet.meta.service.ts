import { Injectable } from '@nestjs/common';
import { IMeta } from '@apitable/core';
import { ServerException, PermissionException } from 'exception';
import { IBaseException } from 'exception/base.exception';
import { DatasheetMetaRepository } from 'modules/repository/datasheet.meta.repository';

/**
 * Datasheet Meta 服务
 *
 * @class DatasheetMetaService
 */
@Injectable()
export class DatasheetMetaService {
  public constructor(private repository: DatasheetMetaRepository) {}

  async getMetaDataMaybeNull(dstId: string): Promise<IMeta | undefined> {
    const metaEntity = await this.repository.selectMetaByDstId(dstId);
    return metaEntity?.metaData;
  }

  async getMetaDataByDstId(dstId: string, exception?: IBaseException, ignoreDeleted = false): Promise<IMeta> {
    const metaEntity = ignoreDeleted ? await this.repository.selectMetaByDstIdIgnoreDeleted(dstId) : await this.repository.selectMetaByDstId(dstId);
    if (metaEntity?.metaData) {
      return metaEntity.metaData;
    }
    throw new ServerException(exception ? exception : PermissionException.NODE_NOT_EXIST);
  }

  async getMetaMapByDstIds(dstIds: string[], ignoreDeleted = false): Promise<{ [dstId: string]: IMeta }> {
    const metas = ignoreDeleted ? await this.repository.selectMetaByDstIdsIgnoreDeleted(dstIds) : await this.repository.selectMetaByDstIds(dstIds);
    return metas.reduce<{ [dstId: string]: IMeta }>((pre, cur) => {
      if (cur.dstId && cur.metaData) {
        pre[cur.dstId] = cur.metaData;
      }
      return pre;
    }, {});
  }

  /**
   * 通过sql查询出fieldIds 优化内存
   * @param dstId 数表ID
   * @param filterFieldIds 需要过滤的列ID
   * @param excludedFieldType 需要排除的列类型
   * @return 满足条件的列ID
   * @author Zoe Zheng
   * @date 2021/4/22 2:26 下午
   */
  async getFieldIdByDstId(dstId: string, filterFieldIds: string[], excludedFieldType: Set<number>): Promise<string[]> {
    const raw = await this.repository.selectFieldMapByDstId(dstId);
    const fieldIds: string[] = [];
    if (raw && raw.fieldMap) {
      for (const fieldId in raw.fieldMap) {
        // 排序关键列
        if ((!excludedFieldType || !excludedFieldType.has(raw.fieldMap[fieldId].type) && !filterFieldIds.includes(fieldId))) {
          fieldIds.push(fieldId);
        }
      }
    }
    return fieldIds;
  }
}
