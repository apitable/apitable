import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { IdWorker } from 'shared/helpers/snowflake';

/**
 * Workbench-Developer
 */
@Entity('vika_developer')
export class DeveloperEntity {
  @Column({
    name: 'user_id',
    nullable: false,
    unique: true,
    comment: 'user ID',
    width: 20,
    type: 'bigint',
  })
    userId: bigint;

  @Column({
    name: 'api_key',
    nullable: false,
    comment: 'The only token of the developer platform',
    length: 64,
  })
    apiKey: string;

  // picked from base entity

  @PrimaryColumn('bigint')
    id: string;

  @Column('bigint', {
    name: 'created_by',
    comment: 'creator ID',
  })
    createdBy: string;

  @Column('bigint', {
    name: 'updated_by',
    comment: 'the user who last updated it',
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
