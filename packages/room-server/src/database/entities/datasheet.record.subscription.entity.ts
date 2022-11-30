import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

/**
 * Workbench-Datasheet Record Subscription
 */
@Entity(`datasheet_record_subscription`)
export class DatasheetRecordSubscriptionEntity extends BaseEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: 'datasheet ID(related#vika_datasheet#dst_id)',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'mirror_id',
    nullable: true,
    comment: 'mirror ID',
    length: 50,
  })
    mirrorId: string | null;

  @Column({
    name: 'record_id',
    nullable: false,
    comment: 'record ID(related#vika_datasheet_record#record_id)',
    length: 50,
  })
    recordId: string | null;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: 'creator ID(subscriber)',
  })
    createdBy: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;
}
