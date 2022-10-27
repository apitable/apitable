import { Injectable } from '@nestjs/common';
import { Field, FieldType, IMeta, IRecord, IRecordMap, IReduxState } from '@apitable/core';
import { DatasheetRecordEntity } from '../../entities/datasheet.record.entity';
import { RecordHistoryTypeEnum } from 'shared/enums/record.history.enum';
import { get, isEmpty, keyBy, orderBy } from 'lodash';
import { ChangesetBaseDto } from '../../dtos/changeset.base.dto';
import { CommentEmojiDto } from '../../dtos/comment.emoji.dto';
import { RecordHistoryDto } from '../../dtos/record.history.dto';
import { UnitBaseInfoDto } from '../../dtos/unit.base.info.dto';
import { RecordHistoryQueryRo } from '../../ros/record.history.query.ro';
import { RecordMap } from '../../interfaces';
import { DatasheetRecordRepository } from '../../repositories/datasheet.record.repository';
import { RecordCommentService } from 'database/services/datasheet/record.comment.service';
import { Store } from 'redux';
import { In } from 'typeorm';
import { DatasheetChangesetService } from './datasheet.changeset.service';

/**
 * Datasheet Record 服务
 *
 * @export
 * @class DatasheetRecordService
 */
@Injectable()
export class DatasheetRecordService {
  constructor(
    private readonly recordRepo: DatasheetRecordRepository,
    private readonly recordCommentService: RecordCommentService,
    private readonly datasheetChangesetService: DatasheetChangesetService,
  ) {}

  async insertBatch(entities: DatasheetRecordEntity[]) {
    await this.recordRepo
      .createQueryBuilder()
      .insert()
      .into(DatasheetRecordEntity)
      .values(entities)
      .execute();
  }

  async getByRecordIdsAndIsDeleted(dstId: string, recordIds: string[], isDeleted: boolean): Promise<string[]> {
    const raw = await this.recordRepo
      .createQueryBuilder()
      .select('record_id', 'recordId')
      .where('record_id IN(:...recordIds)', { recordIds })
      .andWhere('dst_id = :dstId', { dstId })
      .andWhere('is_deleted = :isDeleted', { isDeleted })
      .getRawMany();
    return raw.reduce<string[]>((pre, cur) => {
      pre.push(cur.recordId);
      return pre;
    }, []);
  }

  async getRecordsByDstId(dstId: string): Promise<RecordMap> {
    const records = await this.recordRepo.find({
      where: { dstId, isDeleted: false },
    });
    const commentCountMap = await this.recordCommentService.getCommentCountMapByDstId(dstId);
    return this.formatRecordMap(records, commentCountMap);
  }

  async getRecordsByDstIdAndRecordIds(dstId: string, recordIds: string[], isDeleted = false): Promise<RecordMap> {
    const records = await this.recordRepo.find({
      where: { recordId: In(recordIds), dstId, isDeleted },
    });
    const commentCountMap = await this.recordCommentService.getCommentCountMapByDstId(dstId);
    return this.formatRecordMap(records, commentCountMap, recordIds);
  }

  private formatRecordMap(records: DatasheetRecordEntity[], commentCountMap: { [key: string]: number }, recordIds?: string[]): RecordMap {
    if (recordIds) {
      // 按照传入ID排序, 排除一个或者没有的情况
      const recordMap = keyBy(records, 'recordId');
      return recordIds.reduce<RecordMap>((pre, cur) => {
        const record = recordMap[cur];
        if (record) {
          pre[cur] = {
            id: cur,
            data: record.data || {},
            createdAt: Date.parse(record.createdAt.toString()),
            updatedAt: record.updatedAt ? new Date(record.updatedAt).valueOf() : undefined,
            revisionHistory: record.revisionHistory?.split(',').map(x => Number(x)),
            recordMeta: record.recordMeta,
            commentCount: commentCountMap[cur] || 0,
          };
        }
        return pre;
      }, {});
    }
    return records.reduce<RecordMap>((pre, cur) => {
      if (!cur.recordId) {
        return pre;
      }
      pre[cur.recordId] = {
        id: cur.recordId,
        data: cur.data || {},
        createdAt: Date.parse(cur.createdAt.toString()),
        updatedAt: cur.updatedAt ? new Date(cur.updatedAt).valueOf() : undefined,
        revisionHistory: cur.revisionHistory?.split(',').map(x => Number(x)),
        recordMeta: cur.recordMeta,
        commentCount: commentCountMap[cur.recordId] || 0,
      };
      return pre;
    }, {});
  }

  getIdsByDstIdAndRecordIds(dstId: string, recordIds: string[]): Promise<string[] | null> {
    return this.recordRepo.selectIdsByDstIdAndRecordIds(dstId, recordIds);
  }

  async getBaseRecordMap(dstId: string, includeCommentCount = false, ignoreDeleted = false): Promise<IRecordMap> {
    const records = ignoreDeleted
      ? await this.recordRepo.selectRecordsDataByDstIdIgnoreDeleted(dstId)
      : await this.recordRepo.selectRecordsDataByDstId(dstId);
    const commentCountMap = includeCommentCount ? await this.recordCommentService.getCommentCountMapByDstId(dstId) : null;
    if (!records) {
      return {};
    }
    return records.reduce<IRecordMap>((pre, cur) => {
      pre[cur.recordId] = {
        id: cur.recordId,
        data: cur.data,
        commentCount: commentCountMap && commentCountMap[cur.recordId] ? commentCountMap[cur.recordId] : 0,
      };
      return pre;
    }, {});
  }

  /**
   * todo 优化数据查询，减少compose次数，减少循环次数
   * @param spaceId 空间站ID
   * @param dstId 数表ID
   * @param recordId 记录ID
   * @param query 参数
   * @param showRecordHistory 是否展示记录的修改历史
   * @param fieldIds 需要保留的列
   * @return
   * @author Zoe Zheng
   * @date 2021/4/9 4:05 下午
   */
  async getActivityList(
    spaceId: string,
    dstId: string,
    recordId: string,
    showRecordHistory: boolean,
    query: RecordHistoryQueryRo,
    fieldIds: string[],
  ): Promise<RecordHistoryDto | null> {
    let changesets: ChangesetBaseDto[] = [];
    const units: UnitBaseInfoDto[] = [];
    let emojis: CommentEmojiDto = {};
    const revisions = await this.getRecordRevisionHistoryAsc(dstId, recordId, query.type, showRecordHistory, query.limitDays);
    const maxRevisionIndex =
      query.maxRevision && revisions.includes(query.maxRevision.toString()) ? revisions.indexOf(query.maxRevision.toString()) : revisions.length;
    const canLoopRevisions = query.maxRevision ? revisions.slice(0, maxRevisionIndex).reverse() : revisions.reverse();
    if (!canLoopRevisions.length) {
      return { changesets, units, emojis, commentReplyMap: {}};
    }
    const doublePageSize = query.pageSize * 2;
    const maxTimes = Math.ceil(canLoopRevisions.length / doublePageSize);
    let lastChangeset;
    for (let i = 0; i < maxTimes; i++) {
      // slice [)
      const tmp = canLoopRevisions.slice(i * doublePageSize, (i + 1) * doublePageSize);
      const result = await this.datasheetChangesetService.getRecordActivityChangesetList(spaceId, dstId, recordId, lastChangeset, tmp, fieldIds);
      // 如果不是最后一页把上一页最后一个记录的修改重新放进去，进行合并 todo 这里有点问题，下一页为空的时候，lastChangeset没有重置
      if (i + 1 != maxTimes && result.recordChangesets.length) {
        //  在一次查询的分页内，每次上下页合并的changeset条数为最doublePageSize * query.pageSize多个
        if (i != 0 && i % query.pageSize === 0) {
          lastChangeset = undefined;
        } else {
          lastChangeset = result.recordChangesets.pop();
        }
      }
      changesets.push(...result.recordChangesets);
      changesets.push(...result.commentChangesets);
      units.push(...result.users);
      if (changesets.length >= query.pageSize) {
        break;
      }
    }
    changesets = orderBy(changesets, ['revision'], ['desc']).slice(0, query.pageSize);
    // 减少查询量
    const mentionedRevisions: number[] = [];
    const replyCommentIds: Set<string> = new Set();
    changesets = changesets.map(item => {
      if (item.isComment) {
        mentionedRevisions.push(Number(item.revision));
        const replyComment = get(item, 'operations.0.actions.0.li.commentMsg.reply');
        if (!isEmpty(replyComment) && replyComment.commentId) {
          // 记录存在回复的Id
          replyCommentIds.add(replyComment.commentId);
        }
      }
      return { ...item, createdAt: item.tmpCreatedAt, tmpCreatedAt: undefined };
    });
    if (mentionedRevisions.length) {
      // 用户
      const mentionedUsers = await this.recordCommentService.getMentionedUnitsByRevisions(dstId, recordId, mentionedRevisions);
      units.push(...mentionedUsers);
      // 点赞（emoji）信息
      emojis = await this.recordCommentService.getEmojisByRevisions(dstId, recordId, mentionedRevisions);
    }
    const commentReplyMap = await this.getCommentReplyMap(dstId, recordId, Array.from(replyCommentIds));
    return { changesets, units, emojis, commentReplyMap };
  }

  /**
   * @description 根据给的 commentIds 查询相应的原文
   * @param dstId       数表ID
   * @param recordId    记录ID
   * @param commentIds  评论ID集合
   */
  async getCommentReplyMap(dstId: string, recordId: string, commentIds: string[]) {
    if (!commentIds.length) {
      return {};
    }
    const commentStateList = await this.recordCommentService.getCommentStateByCommentIds(dstId, recordId, commentIds);
    return commentStateList.reduce((commentStateMapById, originComment) => {
      commentStateMapById[originComment.commentId] = originComment.commentState ? { isDeleted: true, commentId: originComment.commentId } :
        originComment.commentMsg.content;
      return commentStateMapById;
    }, {});
  }

  /**
   * 升序查询record的版本记录
   *
   * @param dstId 数表ID
   * @param recordId 记录ID
   * @param type 记录历史的类型
   * @param showRecordHistory 是否显示记录的修改历史
   * @param limitDays 限制天数
   * @return string[]
   * @author Zoe Zheng
   * @date 2021/4/12 11:48 上午
   */
  async getRecordRevisionHistoryAsc(
    dstId: string,
    recordId: string,
    type: RecordHistoryTypeEnum,
    showRecordHistory = true,
    limitDays?: number,
  ): Promise<string[]> {
    if (type == RecordHistoryTypeEnum.MODIFY_HISTORY && showRecordHistory) {
      const result: { revisionHistory: string } | undefined = await this.recordRepo.selectRevisionHistoryByDstIdAndRecordId(dstId, recordId);
      if (result && result.revisionHistory) {
        const revisions = result.revisionHistory.split(',');
        if (limitDays) {
          return this.datasheetChangesetService.getRecordModifyRevisions(dstId, revisions, limitDays);
        }
        return revisions;
      }
    }
    if (type == RecordHistoryTypeEnum.COMMENT) {
      return await this.recordCommentService.getRecordCommentRevisions(dstId, recordId);
    }
    if (type == RecordHistoryTypeEnum.ALL) {
      const modifyRevisions = await this.getRecordRevisionHistoryAsc(
        dstId,
        recordId,
        RecordHistoryTypeEnum.MODIFY_HISTORY,
        showRecordHistory,
        limitDays,
      );
      const commentRevisions = await this.recordCommentService.getRecordCommentRevisions(dstId, recordId);
      modifyRevisions.push(...commentRevisions);
      return modifyRevisions.sort((a, b) => Number(a) - Number(b));
    }
    return [];
  }

  async getLinkRecordIdsByRecordIdAndFieldId(dstId: string, recordId: string, fieldId: string) {
    const raw = await this.recordRepo.selectLinkRecordIdsByRecordIdAndFieldId(dstId, recordId, fieldId);
    if (raw) {
      return raw[0]?.linkRecordIds;
    }
    return [];
  }

  public getRecordTitle(record: IRecord, datasheetMeta: IMeta, store: Store<IReduxState>) {
    const primaryFieldId = datasheetMeta.views[0].columns[0].fieldId;
    const primaryField = datasheetMeta.fieldMap[primaryFieldId];

    if (primaryField.type === FieldType.Formula) {
      return '首列为公式类型，暂无法展示内容';
    }
    
    return Field.bindContext(primaryField, store.getState()).cellValueToString(record.data[primaryFieldId]) || '';
  }
}
