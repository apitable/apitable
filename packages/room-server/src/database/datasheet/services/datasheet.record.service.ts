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

import { Field, FieldType, IMeta, IRecord, IRecordMap, IReduxState } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { RecordCommentService } from './record.comment.service';
import { get, isEmpty, keyBy, orderBy } from 'lodash';
import { Store } from 'redux';
import { RecordHistoryTypeEnum } from 'shared/enums/record.history.enum';
import { In, SelectQueryBuilder } from 'typeorm';
import { ChangesetBaseDto } from '../dtos/changeset.base.dto';
import { CommentEmojiDto } from '../dtos/comment.emoji.dto';
import { RecordHistoryDto } from '../dtos/record.history.dto';
import { UnitBaseInfoDto } from '../../../unit/dtos/unit.base.info.dto';
import { DatasheetRecordEntity } from '../entities/datasheet.record.entity';
import { RecordMap } from '../../interfaces';
import { DatasheetRecordRepository } from '../../datasheet/repositories/datasheet.record.repository';
import { RecordHistoryQueryRo } from '../ros/record.history.query.ro';
import { DatasheetChangesetService } from './datasheet.changeset.service';

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
      select: ['recordId', 'data', 'revisionHistory', 'createdAt', 'updatedAt', 'recordMeta'],
      where: { dstId, isDeleted: false },
    });
    const commentCountMap = await this.recordCommentService.getCommentCountMapByDstId(dstId);
    return this.formatRecordMap(records, commentCountMap);
  }

  async getRecordsByDstIdAndRecordIds(dstId: string, recordIds: string[], isDeleted = false): Promise<RecordMap> {
    const records = await this.recordRepo.find({
      select: ['recordId', 'data', 'revisionHistory', 'createdAt', 'updatedAt', 'recordMeta'],
      where: { recordId: In(recordIds), dstId, isDeleted },
    });
    const commentCountMap = await this.recordCommentService.getCommentCountMapByDstId(dstId);
    return this.formatRecordMap(records, commentCountMap, recordIds);
  }

  async getRelatedRecordCells(datasheetId: string, recordIds: string[], fieldKeyNames: string[], isDeleted = false): Promise<RecordMap> {
    const raw = await this.getSelectQueryBuilder(datasheetId, recordIds, fieldKeyNames, isDeleted).getRawMany();
    const records = raw.reduce<any[]>((pre, cur) => {
      const data = {};
      for (const fieldKeyName of fieldKeyNames) {
        data[fieldKeyName] = cur[fieldKeyName];
      }
      const record = { recordId: cur.recordId, data, recordMeta: { fieldUpdatedMap: cur.fieldUpdatedMap }};
      pre.push(record);
      return pre;
    }, []);
    return this.formatRecordMapWithRelatedCellsOnly(records);
  }

  private getSelectQueryBuilder(
    datasheetId: string,
    recordIds: string[],
    fieldKeyNames: string[],
    isDeleted = false,
  ): SelectQueryBuilder<DatasheetRecordEntity> {
    const selectQueryBuilder = this.recordRepo.createQueryBuilder().select('record_id', 'recordId');
    for (const fieldKeyName of fieldKeyNames) {
      const jsonExtractFieldKeyName = `JSON_EXTRACT(data, '$.${fieldKeyName}')`;
      selectQueryBuilder.addSelect(jsonExtractFieldKeyName, fieldKeyName);
    }
    selectQueryBuilder.addSelect("JSON_EXTRACT(field_updated_info, '$.fieldUpdatedMap')", 'fieldUpdatedMap');
    selectQueryBuilder
      .where('record_id IN(:...recordIds)', { recordIds })
      .andWhere('dst_id = :datasheetId', { datasheetId })
      .andWhere('is_deleted = :isDeleted', { isDeleted });
    return selectQueryBuilder;
  }

  private formatRecordMapWithRelatedCellsOnly(records: DatasheetRecordEntity[]) {
    return records.reduce<RecordMap>((pre, cur) => {
      pre[cur.recordId!] = {
        id: cur.recordId!,
        data: cur.data || {},
        recordMeta: cur.recordMeta,
        commentCount: undefined as any,
      };
      return pre;
    }, {});
  }

  private formatRecordMap(records: DatasheetRecordEntity[], commentCountMap: { [key: string]: number }, recordIds?: string[]): RecordMap {
    if (recordIds) {
      // recordMap follows the order of 'records'
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
        data: cur.data!,
        commentCount: commentCountMap && commentCountMap[cur.recordId] ? commentCountMap[cur.recordId]! : 0,
      };
      return pre;
    }, {});
  }

  /**
   * TODO optimize data query, reduce compose uses, reduce loops
   * @param spaceId space ID
   * @param dstId datasheet ID
   * @param recordId record ID
   * @param query query parameters
   * @param showRecordHistory if record change history is shown
   * @param fieldIds IDs of preserved fields
   * @return
   * @author Zoe Zheng
   * @date 2021/4/9 4:05 PM
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
    let lastChangeset: ChangesetBaseDto | undefined;
    for (let i = 0; i < maxTimes; i++) {
      // slice [)
      const tmp = canLoopRevisions.slice(i * doublePageSize, (i + 1) * doublePageSize);
      const result = await this.datasheetChangesetService.getRecordActivityChangesetList(spaceId, dstId, recordId, lastChangeset, tmp, fieldIds);
      // TODO this is problematic, when next page is empty, lastChangeset is not reset
      // If not last page, get last changeset of previous page, perform merging
      if (i + 1 != maxTimes && result.recordChangesets.length) {
        // In pagination of one query, numbers of merged changeset in adjacent pages
        // is at most doublePageSize * query.pageSize
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
    // reduce queried data size
    const mentionedRevisions: number[] = [];
    const replyCommentIds: Set<string> = new Set();
    changesets = changesets.map(item => {
      if (item.isComment) {
        mentionedRevisions.push(Number(item.revision));
        const replyComment = get(item, 'operations.0.actions.0.li.commentMsg.reply');
        if (!isEmpty(replyComment) && replyComment.commentId) {
          // record replied comment ID
          replyCommentIds.add(replyComment.commentId);
        }
      }
      return { ...item, createdAt: item.tmpCreatedAt!, tmpCreatedAt: undefined };
    });
    if (mentionedRevisions.length) {
      const mentionedUsers = await this.recordCommentService.getMentionedUnitsByRevisions(dstId, recordId, mentionedRevisions);
      units.push(...mentionedUsers);
      emojis = await this.recordCommentService.getEmojisByRevisions(dstId, recordId, mentionedRevisions);
    }
    const commentReplyMap = await this.getCommentReplyMap(dstId, recordId, Array.from(replyCommentIds));
    return { changesets, units, emojis, commentReplyMap };
  }

  /**
   * Fetch comments by comment IDs
   *
   * @param dstId       datasheet ID
   * @param recordId    record ID
   * @param commentIds  comment ID set
   */
  async getCommentReplyMap(dstId: string, recordId: string, commentIds: string[]) {
    if (!commentIds.length) {
      return {};
    }
    const commentStateList = await this.recordCommentService.getCommentStateByCommentIds(dstId, recordId, commentIds);
    return commentStateList.reduce((commentStateMapById, originComment) => {
      commentStateMapById[originComment.commentId] = originComment.commentState
        ? { isDeleted: true, commentId: originComment.commentId }
        : originComment.commentMsg.content;
      return commentStateMapById;
    }, {});
  }

  /**
   * Obtain record revisions in ascending order of revisions
   *
   * @param dstId datasheet ID
   * @param recordId record ID
   * @param type record history type
   * @param showRecordHistory if record change history is shown
   * @param limitDays limit days
   * @return string[]
   * @author Zoe Zheng
   * @date 2021/4/12 11:48 AM
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
    const primaryFieldId = datasheetMeta.views[0]!.columns[0]!.fieldId;
    const primaryField = datasheetMeta.fieldMap[primaryFieldId]!;

    if (primaryField.type === FieldType.Formula) {
      return 'Formula primary field cannot be shown';
    }

    return Field.bindContext(primaryField, store.getState()).cellValueToString(record.data[primaryFieldId]!) || '';
  }
}
