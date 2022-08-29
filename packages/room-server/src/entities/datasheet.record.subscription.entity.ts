import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * 工作台-数表记录订阅表
 */
@Entity('vika_datasheet_record_subscription')
export class DatasheetRecordSubscriptionEntity extends BaseEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: '数表ID(关联#vika_datasheet#dst_id)',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'mirror_id',
    nullable: true,
    comment: '镜像节点ID',
    length: 50,
  })
    mirrorId: string | null;

  @Column({
    name: 'record_id',
    nullable: false,
    comment: '数据记录ID(关联#vika_datasheet_record#record_id)',
    length: 50,
  })
    recordId: string | null;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: '创建者(即订阅者)',
  })
    createdBy: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;
}
