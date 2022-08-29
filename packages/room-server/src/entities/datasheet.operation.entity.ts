import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * 工作台-数表操作表
 */
@Entity('vika_datasheet_operation')
export class DatasheetOperationEntity extends BaseEntity {

  @Column({
    name: 'op_id',
    nullable: true,
    unique: true,
    comment: '操作ID',
    length: 50,
  })
    opId: string | null;

  @Column({
    name: 'dst_id',
    nullable: true,
    comment: '数表ID(关联#vika_datasheet#dst_id)',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'action_name',
    nullable: true,
    comment: '操作名称',
    length: 255,
  })
    actionName: string | null;

  @Column('json', { name: 'actions', nullable: true, comment: '操作的合集' })
    actions: object | null;

  @Column({
    name: 'type',
    nullable: true,
    comment: '类型(1:JOT,2:COT)',
    unsigned: true,
  })
    type: number | null;

  @Column( {
    name: 'member_id',
    nullable: true,
    comment: '操作成员ID(关联#vika_organization_member#id)',
  })
    memberId: string | null;

  @Column( {
    name: 'revision',
    comment: '版本号',
    unsigned: true,
    default: () => '\'0\'',
  })
    revision: number;
}
