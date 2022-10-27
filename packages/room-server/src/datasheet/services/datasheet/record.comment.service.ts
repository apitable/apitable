import { Injectable } from '@nestjs/common';
import { ICommentContent, ICommentMsg, IListInsertAction } from '@apitable/core';
import { JavaApiPath } from '../../../shared/common';
import { ApiTipIdEnum } from 'shared/enums/string.enum';
import { ApiException } from '../../../shared/exception/api.exception';
import { IAuthHeader } from '../../../shared/interfaces';
import { CommentDto } from '../../dtos/comment.dto';
import { CommentListVo } from '../../vos/comment.list.vo';
import { RecordCommentRepository } from '../../repositories/record.comment.repository';
import { JavaService } from 'shared/services/java/java.service';
import { UnitService } from 'datasheet/services/unit/unit.service';
import { pickBy, isEmpty } from 'lodash';
import { CommonException, ServerException } from '../../../shared/exception';

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
      // 收集用户
      mentionedIds.push(cur.unitId);
      mentionedIds.push(...RecordCommentService.getMentionedId(cur.commentMsg));
      return pre;
    }, []);
    // 去重
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
    // 封装返回数据
    if (res.code && res.code === JavaService.SUCCESS_CODE) {
      const spacePermissions = res.data.spaceResource.permissions;
      return spacePermissions && spacePermissions.includes('MANAGE_WORKBENCH');
    }
    return new ServerException(CommonException.SERVER_ERROR);
  }

  async deleteCommentBySelf(commentCreatedBy: string, uuid?: string) {
    const memberInfos = await this.unitService.getUnitMemberInfoByIds([commentCreatedBy]);
    const firstMemberInfo = memberInfos && memberInfos[0];
    return firstMemberInfo && firstMemberInfo.userId === uuid;
  }

  getCommentCountMapByDstId(dstId: string): Promise<{ [recordId: string]: number }> {
    return this.repo.selectRecordCommentCountByDstId(dstId);
  }

  /**
   * 获取记录评论的版本号
   * @param dstId 数表ID
   * @param recordId 记录ID
   * @param excludeDeleted 是否排除删除的记录
   * @return string[]
   * @author Zoe Zheng
   * @date 2021/4/21 5:24 下午
   */
  async getRecordCommentRevisions(dstId: string, recordId: string, excludeDeleted = true): Promise<string[]> {
    const result = await this.repo.selectReversionsByDstIdAndRecordId(dstId, recordId, excludeDeleted);
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
   * @description 解析 Draft.js 的结构，取出数据
   * @param {*} content
   * @returns
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
   * @description 由于存在多种编辑器的可能，不同编辑器的数据结构也不一样，
   * 需要根据 msg 里的 type 区分处理
   * @param {ICommentMsg} msg
   * @returns {Promise<string[]>}
   */
  private static getMentionedId(msg: ICommentMsg) {
    // Draft.js 编辑器
    if (msg.type === 'dfs' && msg.content) {
      return RecordCommentService.parseDraftContent(msg.content);
    }
    return [];
  }

  /**
   * 查询单条评论
   * @param dstId     数表Id
   * @param recordId  记录Id
   * @param commentId 评论Id
   */
  async getCommentByCommentId(dstId: string, recordId: string, commentId: string) {
    return await this.repo.selectCommentsByDstIdAndRecordIdAndCommentId(dstId, recordId, commentId);
  }

  /**
   * 获取评论所有的点赞信息
   * @param dstId     数表Id
   * @param recordId  记录Id
   * @param revisions 评论版本号
   */
  async getEmojisByRevisions(dstId: string, recordId: string, revisions: number[]) {
    const rows = await this.repo.selectEmojisByRevisions(dstId, recordId, revisions);
    if (rows) {
      return rows.reduce((pre, cur) => {
        if (cur?.emojis) {
          const pickEmojis:any = pickBy(cur.emojis,v=> !isEmpty(v));
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
   * 获取评论状态
   * @param dstId       数表Id
   * @param recordId    记录Id
   * @param commentIds  评论ID集合
   */
  async getCommentStateByCommentIds(dstId: string, recordId: string, commentIds: string[]) {
    return await this.repo.selectCommentStateByCommentIds(dstId, recordId, commentIds);
  }

  /**
   * 从 JOT Action 获取评论内容
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
      acc.push(`@${content.data.name}`);
      return acc;
    }

    if (!isEmpty(content.children)) {
      content.children.forEach((childContent: ICommentContent) => {
        this.extractTextFromCommentContent(childContent, acc);
      });
    }
    return acc;
  }

}
