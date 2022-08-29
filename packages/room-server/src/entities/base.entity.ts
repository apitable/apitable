import { IdWorker } from 'helpers/snowflake';
import { BeforeInsert, Column, PrimaryColumn } from 'typeorm';

/**
 * 基础字段父类
 */
export abstract class BaseEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'is_deleted',
    comment: '删除标记(0:否,1:是)',
    unsigned: true,
    default: () => false,
  })
    isDeleted: boolean;

  @Column('bigint', {
    name: 'created_by',
    comment: '创建者',
  })
    createdBy: string;

  @Column('bigint', {
    name: 'updated_by',
    comment: '最后一次更新者',
  })
    updatedBy: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: '更新时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date | null;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
