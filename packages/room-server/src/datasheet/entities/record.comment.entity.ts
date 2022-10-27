import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { ICommentMsg } from '@apitable/core';

/**
 * 工作台-数据表格表
 */
@Entity('vika_datasheet_record_comment')
export class RecordCommentEntity extends BaseEntity {
  @Column({
    name: 'dst_id',
    nullable: false,
    comment: '数表ID',
    length: 50,
  })
    dstId: string;

  @Column({
    name: 'record_id',
    nullable: false,
    comment: '记录ID',
    length: 50,
  })
    recordId: string;

  @Column({
    name: 'comment_id',
    nullable: false,
    comment: 'chengeset生成的comment_id',
    length: 50,
  })
    commentId: string;

  @Column('json', {
    name: 'comment_msg',
    nullable: false,
    comment: '评论富文本内容',
  })
    commentMsg: ICommentMsg;

  @Column({
    name: 'revision',
    nullable: true,
    comment: '版本号',
    unsigned: true,
    default: () => 0,
    type: 'bigint',
    width: 20,
  })
    revision: number | null;

  @Column({
    name: 'unit_id',
    nullable: false,
    comment: '操作成员unitID(关联#vika_unit#id)',
    width: 20,
    type: 'bigint',
  })
    unitId: string;
}
