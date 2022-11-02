import { IdWorker } from 'shared/helpers/snowflake';
import { BeforeInsert, Column, PrimaryColumn } from 'typeorm';

/**
 * base entity class with common fields
 */
export abstract class BaseEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'is_deleted',
    comment: 'wether it is deleted(0: no, 1: yes)',
    unsigned: true,
    default: () => false,
  })
    isDeleted: boolean;

  @Column('bigint', {
    name: 'created_by',
    comment: 'user ID of creator',
  })
    createdBy: string;

  @Column('bigint', {
    name: 'updated_by',
    comment: 'ID of use who last updated id',
  })
    updatedBy: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: 'updated time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date | null;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
