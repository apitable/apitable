import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { IdWorker } from 'shared/helpers/snowflake';

/**
 * 工作台-数据表格表
 */
@Entity('vika_developer')
export class DeveloperEntity {
  @Column({
    name: 'user_id',
    nullable: false,
    unique: true,
    comment: '用户ID',
    width: 20,
    type: 'bigint',
  })
    userId: bigint;

  @Column({
    name: 'api_key',
    nullable: false,
    comment: '开发者平台唯一令牌',
    length: 64,
  })
    apiKey: string;

  // picked from base entity

  @PrimaryColumn('bigint')
    id: string;

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
