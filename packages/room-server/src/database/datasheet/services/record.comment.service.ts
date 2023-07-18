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

import { ICommentContent, ICommentMsg, IListInsertAction } from '@apitable/core';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { Injectable } from '@nestjs/common';
import { UnitService } from 'unit/services/unit.service';
import { isEmpty, pickBy } from 'lodash';
import { JavaApiPath } from 'shared/common';
import { CommonException, ServerException } from 'shared/exception';
import { IAuthHeader } from 'shared/interfaces';
import { JavaService } from 'shared/services/java/java.service';
import { CommentDto } from '../dtos/comment.dto';
import { RecordCommentRepository } from '../../datasheet/repositories/record.comment.repository';
import { CommentListVo } from '../vos/comment.list.vo';
import { IdWorker } from '../../../shared/helpers';
import { RecordCommentEntity } from '../entities/record.comment.entity';

@Injectable()
export class RecordCommentService {
  constructor(
    private readonly repo: RecordCommentRepository,
    private readonly unitService: UnitService,
    private readonly javaService: JavaService,
  ) {}

  async getCommentEntity(dstId: string, recordId: string) {
    return await this.repo.selectCommentsByDstIdAndRecordId(dstId, recordId);
  }

  async recoverComments(comments: RecordCommentEntity[]) {
    if (comments) {
      comments.forEach(comment => {
        comment.id = IdWorker.nextId() + '';
        comment.revision = 0;
      }
      );
      await this.repo
        .createQueryBuilder()
        .insert()
        .values(comments)
        .execute();
    }
  }

  async getAllCommentsByDstId(dstId: string) {
    return await this.repo.find({
      where: {
        dstId: dstId
      }
    });
  }

  /**
   * @deprecated
   * @param dstId
   * @param recordId
   */
  async getComments(dstId: string, recordId: string): Promise<CommentListVo> {
    const entities = await this.getCommentEntity(dstId, recordId);
    if (!entities.length) return { comments: [], units: [] };
    const mentionedIds: string[] = [];
    const comments = entities.reduce<CommentDto[]>((pre, cur) => {
      pre.push({
        commentId: cur.commentId,
        commentMsg: cur.commentMsg,
        createdAt: Date.parse(cur.createdAt.toString()),
        updatedAt: cur.updatedAt ? Date.parse(cur.updatedAt.toString()) : undefined,
        createdBy: cur.unitId,
        unitId: cur.unitId,
        revision: Number(cur.revision),
      });
      // Collect users
      mentionedIds.push(cur.unitId);
      mentionedIds.push(...RecordCommentService.getMentionedId(cur.commentMsg));
      return pre;
    }, []);
    // Remove duplicates
    const units = await this.unitService.getUnitMemberInfoByIds(Array.from(new Set(mentionedIds)));
    return { comments, units };
  }

  async checkDeletePermission(auth: IAuthHeader, commentCreatedBy: string, uuid?: string) {
    return (await this.checkSpacePermission(auth)) || (await this.deleteCommentBySelf(commentCreatedBy, uuid));
  }

  async checkSpacePermission(auth: IAuthHeader) {
    let res;
    try {
      res = await this.javaService.setHeaders(auth).get(JavaApiPath.SPACE_RESOURCE);
    } catch (e) {
      return new ServerException(CommonException.SERVER_ERROR);
    }
    if (!res) return new ServerException(CommonException.SERVER_ERROR);
    // Pack response data
    if (res.code && res.code === JavaService.SUCCESS_CODE) {
      const spacePermissions = res.data.spaceResource.permissions;
      return spacePermissions && spacePermissions.includes('MANAGE_WORKBENCH');
    }
    return new ServerException(CommonException.SERVER_ERROR);
  }

  private async deleteCommentBySelf(commentCreatedBy: string, uuid?: string) {
    const memberInfos = await this.unitService.getUnitMemberInfoByIds([commentCreatedBy]);
    const firstMemberInfo = memberInfos && memberInfos[0];
    return firstMemberInfo && firstMemberInfo.userId === uuid;
  }

  @Span()
  getCommentCountMapByDstId(dstId: string): Promise<{ [recordId: string]: number }> {
    return this.repo.selectRecordCommentCountByDstId(dstId);
  }

  /**
   * Obtain revisions of record comments
   *
   * @param dstId datasheet ID
   * @param recordId record ID
   * @param excludeDeleted if deleted records are excluded. default to true.
   * @return string[]
   * @author Zoe Zheng
   * @date 2021/4/21 5:24 PM
   */
  async getRecordCommentRevisions(dstId: string, recordId: string, excludeDeleted = true): Promise<string[]> {
    const result = await this.repo.selectRevisionsByDstIdAndRecordId(dstId, recordId, excludeDeleted);
    if (result) {
      return result.map(entity => entity.revision);
    }
    return [];
  }

  async getMentionedUnitIdByRevisions(dstId: string, recordId: string, revisions: number[]): Promise<string[]> {
    const raws = await this.repo.selectMentionedUnitIdByRevisions(dstId, recordId, revisions);
    if (raws) {
      const unitIds = raws.reduce<string[]>((pre, cur) => {
        if (cur.unitIds) {
          pre.push(...cur.unitIds);
        }
        return pre;
      }, []);
      return Array.from(new Set(unitIds));
    }
    return [];
  }

  async getMentionedUnitsByRevisions(dstId: string, recordId: string, revisions: number[]) {
    const unitIds = await this.getMentionedUnitIdByRevisions(dstId, recordId, revisions);
    return await this.unitService.getUnitMemberInfoByIds(unitIds);
  }

  /**
   * Parse Draft.js data and get unit IDs of mentioned users
   */
  private static parseDraftContent(content: any) {
    if (content['entityMap']) {
      const entityMap = content['entityMap'];
      if (!entityMap || Object.prototype.toString.call(entityMap) !== '[object Object]') {
        return [];
      }
      return Object.values(entityMap).reduce<string[]>((pre, cur: any) => {
        if (cur?.data?.mention) {
          pre.push(cur.data.mention.unitId);
        }
        return pre;
      }, []);
    }
    return [];
  }

  /**
   * As there may be multiple comment editors, their handling are different based on type
   *
   * @param {ICommentMsg} msg
   * @returns {string[]}
   */
  private static getMentionedId(msg: ICommentMsg) {
    // Draft.js editor
    if (msg.type === 'dfs' && msg.content) {
      return RecordCommentService.parseDraftContent(msg.content);
    }
    return [];
  }

  /**
   * Get one comment by ID
   */
  async getCommentByCommentId(dstId: string, recordId: string, commentId: string) {
    return await this.repo.selectCommentsByDstIdAndRecordIdAndCommentId(dstId, recordId, commentId);
  }

  /**
   * Get emojis of a comment by revisions
   *
   * @param dstId     datasheet Id
   * @param recordId  record Id
   * @param revisions comment revisions
   */
  async getEmojisByRevisions(dstId: string, recordId: string, revisions: number[]) {
    const rows = await this.repo.selectEmojisByRevisions(dstId, recordId, revisions);
    if (rows) {
      return rows.reduce((pre, cur) => {
        if (cur?.emojis) {
          const pickEmojis: any = pickBy(cur.emojis, v => !isEmpty(v));
          if (!isEmpty(pickEmojis)) {
            pre[cur.commentId] = pickEmojis;
          }
        }
        return pre;
      }, {} as { [commentId: string]: true });
    }
    return {};
  }

  /**
   * @param commentIds  comment ID set
   */
  async getCommentStateByCommentIds(dstId: string, recordId: string, commentIds: string[]) {
    return await this.repo.selectCommentStateByCommentIds(dstId, recordId, commentIds);
  }

  /**
   * Extract comment content from JOT action
   *
   * @param action JOT Action
   */
  public extractCommentTextFromAction(action: IListInsertAction) {
    const commentMsg = action.li.commentMsg;
    if (!commentMsg || isEmpty(commentMsg.content)) return null;

    const commentTextArray = commentMsg.content.reduce((acc: string[], cur: ICommentContent) => {
      this.extractTextFromCommentContent(cur, acc);
      return acc;
    }, []);

    return commentTextArray.join(' ');
  }

  private extractTextFromCommentContent(content: ICommentContent, acc: string[]) {
    if (content.text) {
      acc.push(content.text);
      return acc;
    }

    if (content.type === 'mention') {
      acc.push(`@${content.data!.name}`);
      return acc;
    }

    if (!isEmpty(content.children)) {
      content.children!.forEach((childContent: ICommentContent) => {
        this.extractTextFromCommentContent(childContent, acc);
      });
    }
    return acc;
  }

}
