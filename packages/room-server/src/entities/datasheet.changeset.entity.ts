import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IOperation } from '@vikadata/core';

/**
 * 工作台-数表操作变更合集表
 */
@Entity('vika_datasheet_changeset')
export class DatasheetChangesetEntity extends BaseEntity {

  @Column({
    name: 'message_id',
    nullable: true,
    comment: 'changeset请求的唯一标识，用于保证changeset的唯一',
    length: 255,
  })
    messageId: string | null;

  @Column( {
    name: 'dst_id',
    nullable: true,
    comment: '数表ID',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'member_id',
    nullable: true,
    comment: '操作成员ID(关联#vika_organization_member#id)',
  })
    memberId: string | null;

  @Column('json', {
    name: 'operations',
    nullable: true,
    comment: '操作action的合集',
  })
    operations: IOperation[] | null;

  @Column( {
    name: 'revision',
    nullable: true,
    comment: '版本号',
    unsigned: true,
    default: () => '\'0\'',
  })
    revision: number | null;
}
